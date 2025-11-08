import { useState, useEffect } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { LoginScreen } from '@/components/LoginScreen';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const APP_PASSWORD = 'temp1234';
const SESSION_KEY = 'roboSouthLA_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const PAT = 'patPWGKtL2NqRQBya.dacbf7d926800e780f2686865d54b1e6220b1f198b943117674a43af5b0cf50d';
const BASE = 'appLCkO4915Nj7xTe';
const TABLE = 'Master Video List';
const URL_FIELD = 'Preview URL';
const STATUS_FIELD = 'Status';

interface VideoRecord {
  id: string;
  fields: {
    [URL_FIELD]: string;
    [STATUS_FIELD]?: string;
  };
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Loading videos...');
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadVideos();
    }
  }, [isAuthenticated]);

  const checkAuth = () => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        if (now < sessionData.expiry) {
          setIsAuthenticated(true);
          return;
        }
      } catch (e) {
        console.error('Invalid session data');
      }
      localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  };

  const handleLogin = (password: string) => {
    if (password === APP_PASSWORD) {
      const expiry = new Date().getTime() + SESSION_DURATION;
      localStorage.setItem(SESSION_KEY, JSON.stringify({ expiry }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
  };

  const loadVideos = async () => {
    try {
      setLoading(true);
      const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?filterByFormula=({${STATUS_FIELD}} = BLANK())&sort[0][field]=First Seen&sort[0][direction]=desc`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${PAT}` }
      });

      if (!response.ok) throw new Error('Failed to load videos');

      const data = await response.json();
      const filteredVideos = data.records.filter((r: VideoRecord) => r.fields[URL_FIELD]);

      if (filteredVideos.length === 0) {
        setMessage('All done! No videos to review.');
        setVideos([]);
      } else {
        setVideos(filteredVideos);
        setCurrentIndex(0);
        setMessage('');
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      setMessage('Error loading videos. Check console.');
      toast({
        title: "Error",
        description: "Failed to load videos from Airtable",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (currentIndex >= videos.length) return;

    const recordId = videos[currentIndex].id;
    const payload = { fields: { [STATUS_FIELD]: status } };

    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${PAT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.type || 'Unknown error');
      }

      toast({
        title: "Success",
        description: `Video marked as ${status}`,
      });

      // Remove the current video and show next one
      const newVideos = [...videos];
      newVideos.splice(currentIndex, 1);
      setVideos(newVideos);

      if (newVideos.length === 0) {
        setMessage('All videos reviewed!');
      } else if (currentIndex >= newVideos.length) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update video status",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-foreground text-lg">{message}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background px-5">
        <Button
          onClick={handleLogout}
          className="absolute top-5 right-5 safe-top bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-full px-4 py-2"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
        <p className="text-foreground text-lg text-center">{message}</p>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];
  let videoUrl = currentVideo.fields[URL_FIELD];
  videoUrl = videoUrl.replace('http://192.168.1.210:8081', 'https://videos.robosouthla.com') + '#t=0.1';

  return (
    <div className="relative h-screen bg-background">
      <Button
        onClick={handleLogout}
        className="absolute top-5 right-5 safe-top z-50 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-full px-4 py-2"
      >
        <LogOut className="w-4 h-4 mr-2" /> Logout
      </Button>

      <VideoPlayer
        url={videoUrl}
        onUpload={() => updateStatus('Ready To Upload')}
        onScheduled={() => updateStatus('Scheduled')}
        onSkip={handleSkip}
      />
    </div>
  );
};

export default Index;

import { useState } from "react";
import { MediaUploader } from "../MediaUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  FileVideo,
  FileImage,
  Download,
  Share2,
  Eye,
  Heart,
  MessageCircle,
  Info,
  CheckCircle,
  Clock
} from "lucide-react";

interface DemoMediaFile {
  id: string;
  name: string;
  type: 'video' | 'gif';
  size: string;
  duration?: number;
  uploadDate: string;
  status: 'ready';
}

export function MediaUploadDemo() {
  const [uploadedFiles, setUploadedFiles] = useState<DemoMediaFile[]>([]);
  const [uploadCount, setUploadCount] = useState(0);

  // Example demonstration files
  const demoFiles: DemoMediaFile[] = [
    {
      id: 'demo-1',
      name: 'climate-animation.mp4',
      type: 'video',
      size: '15.3 MB',
      duration: 45,
      uploadDate: new Date().toISOString(),
      status: 'ready'
    },
    {
      id: 'demo-2',
      name: 'ocean-currents.gif',
      type: 'gif',
      size: '8.7 MB',
      uploadDate: new Date().toISOString(),
      status: 'ready'
    }
  ];

  const handleMediaUploaded = (newFiles: any[]) => {
    // Convert to demo format
    const demoFiles: DemoMediaFile[] = newFiles.map((file, index) => ({
      id: `upload-${uploadCount + index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      duration: file.duration,
      uploadDate: new Date().toISOString(),
      status: 'ready' as const
    }));

    setUploadedFiles(prev => [...prev, ...demoFiles]);
    setUploadCount(prev => prev + newFiles.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <Badge variant="secondary" className="mb-4">
              <Upload className="h-4 w-4 mr-2" />
              Media Upload Demo
            </Badge>
            <h1 className="text-4xl md:text-5xl mb-4">
              Upload MP4 & GIF Files
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Demonstration of the media upload system supporting MP4 videos and GIF animations 
              for climate education and community content.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Try Upload Below</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>View Examples</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <MediaUploader
              onMediaUploaded={handleMediaUploaded}
              maxFileSize={100}
              acceptedTypes={['.mp4', '.gif', '.webm', '.mov']}
              multiple={true}
              showPreview={true}
              category="climate-demo"
            />
          </div>
        </div>
      </section>

      {/* Upload Results */}
      {uploadedFiles.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Successfully Uploaded Files ({uploadedFiles.length})</span>
                  </CardTitle>
                  <CardDescription>
                    Your media files have been processed and are ready for use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {file.type === 'video' ? (
                              <FileVideo className="h-10 w-10 text-blue-500" />
                            ) : (
                              <FileImage className="h-10 w-10 text-green-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{file.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Badge variant="outline" className="text-xs">
                                  {file.type.toUpperCase()}
                                </Badge>
                              </span>
                              <span>{file.size}</span>
                              {file.duration && (
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDuration(file.duration)}</span>
                                </span>
                              )}
                              <span>{formatDate(file.uploadDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Demo Examples */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl mb-6 text-center">Example Climate Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 flex items-center justify-center">
                    {file.type === 'video' ? (
                      <div className="text-center">
                        <Video className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                        <p className="text-sm text-muted-foreground">Video Preview</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 text-green-500" />
                        <p className="text-sm text-muted-foreground">GIF Animation</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{file.name}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {file.type.toUpperCase()}
                        </Badge>
                        <span>{file.size}</span>
                      </div>
                      {file.duration && (
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(file.duration)}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>1.2k</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>89</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>23</span>
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Information */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl mb-8 text-center">Media Upload Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Video className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-medium mb-2">Video Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload MP4, WebM, and MOV video files up to 100MB with automatic thumbnail generation
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="font-medium mb-2">GIF Animations</h3>
                  <p className="text-sm text-muted-foreground">
                    Support for animated GIF files with dimension detection and preview capabilities
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-medium mb-2">Easy Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop interface with progress tracking and batch upload support
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Supported formats:</strong> MP4, GIF, WebM, MOV • 
                <strong>Max file size:</strong> 100MB • 
                <strong>Features:</strong> Drag & drop, progress tracking, thumbnail generation, metadata extraction • 
                <strong>Integration:</strong> Ready for backend storage services (AWS S3, Cloudinary, etc.)
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    </div>
  );
}
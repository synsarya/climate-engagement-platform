import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { BookOpen, Clock, Users, Star, Play, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const courses = [
  {
    id: 1,
    title: "Climate Science Fundamentals",
    description: "Understanding the basic principles of climate change and global warming",
    duration: "6 weeks",
    students: 12500,
    rating: 4.8,
    progress: 0,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1638068110878-c412de93e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHdpbmR8ZW58MXx8fHwxNzU4NjIwNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    title: "Renewable Energy Systems",
    description: "Deep dive into solar, wind, and hydroelectric power technologies",
    duration: "8 weeks",
    students: 8200,
    rating: 4.9,
    progress: 65,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1638068110878-c412de93e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHdpbmR8ZW58MXx8fHwxNzU4NjIwNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    title: "Carbon Footprint Analysis",
    description: "Learn to calculate, track, and reduce personal and organizational carbon footprints",
    duration: "4 weeks",
    students: 15600,
    rating: 4.7,
    progress: 100,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1612198273689-b437f53152ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0cyUyMGdyYXBoc3xlbnwxfHx8fDE3NTg2MTI2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    title: "Climate Policy & Advocacy",
    description: "Understanding climate policy frameworks and effective advocacy strategies",
    duration: "10 weeks",
    students: 5400,
    rating: 4.6,
    progress: 0,
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1591025294860-c830b21298b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBhY3RpdmlzbSUyMHByb3Rlc3QlMjBtYXJjaHxlbnwxfHx8fDE3NTg2OTIxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const learningPaths = [
  {
    title: "Climate Science Track",
    courses: 5,
    duration: "3 months",
    description: "Complete foundation in climate science and environmental systems"
  },
  {
    title: "Renewable Energy Track",
    courses: 7,
    duration: "4 months",
    description: "Technical expertise in clean energy technologies and implementation"
  },
  {
    title: "Climate Action Track",
    courses: 4,
    duration: "2 months",
    description: "Practical skills for personal and community climate action"
  }
];

interface LearningHubProps {
  user?: any;
  onCourseClick?: (courseId: number) => void;
}

export function LearningHub({ user, onCourseClick }: LearningHubProps = {}) {
  const handleCourseClick = (courseId: number) => {
    if (onCourseClick) {
      onCourseClick(courseId);
    } else {
      console.log(`Course ${courseId} clicked`);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Climate Learning Hub</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Master climate science, renewable energy, and environmental policy through 
            expert-designed courses and hands-on projects.
          </p>
        </div>

        {/* Learning Paths */}
        <div className="mb-12">
          <h3 className="text-xl mb-6">Learning Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <Card key={index} className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span>{path.courses} courses</span>
                    <span>{path.duration}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Start Learning Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Featured Courses</h3>
            <Button variant="outline">View All Courses</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="sm" className="rounded-full">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {course.level}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-3">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{course.rating}</span>
                  </div>
                  
                  {course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    variant={course.progress > 0 ? "outline" : "default"}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    {!user ? (
                      "Sign in to Start"
                    ) : course.progress === 100 ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : course.progress > 0 ? (
                      "Continue Learning"
                    ) : (
                      "Start Course"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

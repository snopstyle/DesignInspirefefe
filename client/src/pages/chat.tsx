import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const formatLine = (line: string) => {
  // Format bullet points and numbered lists
  if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
    const parts = line.split(':');
    if (parts.length > 1) {
      return (
        <>
          <strong>{parts[0]}:</strong>
          <span className="font-extralight">{parts.slice(1).join(':')}</span>
        </>
      );
    }
    return line;
  }

  // Format titles (lines ending with ":")
  if (line.endsWith(':')) {
    return <strong>{line}</strong>;
  }

  // Format proper nouns (words starting with capital letters)
  return line.split(' ').map((word, i) => {
    if (word.match(/^[A-Z][a-z]{2,}/)) {
      return <span key={i}><strong>{word}</strong>{' '}</span>;
    }
    return <span key={i}>{word}{' '}</span>;
  });
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chat API');
      }

      const data = await response.json();
      if (data && typeof data.message === 'string') {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message.replace(/\*\*/g, '')
        }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'obtenir une réponse. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-transparent border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-[85px] font-black text-center">
            <span className="bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-['Unbounded']">
              GURU
            </span>
          </CardTitle>
          <CardDescription className="text-center max-w-xl mx-auto text-xl text-gray-400 leading-relaxed">
            Hey ! Je suis ton conseiller d'orientation personnel. 
            Pose-moi tes questions sur les formations, les métiers ou ton avenir, 
            et je t'aide à y voir plus clair avec des réponses personnalisées. 🎯
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[500px] pr-4 mb-6">
            <AnimatePresence initial={false}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 text-white'
                          : 'bg-white/5 border border-white/10 text-white/90'
                      }`}
                    >
                      <div className={`whitespace-pre-wrap text-sm leading-relaxed ${
                        message.role === 'assistant' ? 'font-extralight' : ''
                      }`}>
                        {message.role === 'assistant' 
                          ? message.content.split('\n').map((line, i) => (
                              <p key={i} className="mb-2 last:mb-0">
                                {formatLine(line)}
                              </p>
                            ))
                          : message.content.split('\n').map((line, i) => (
                              <p key={i} className="mb-2 last:mb-0">
                                {line}
                              </p>
                            ))
                        }
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
                      <Loader2 className="h-5 w-5 animate-spin text-white/70" />
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="relative mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose ta question au Guru..."
              className="pr-24 bg-white/5 border-white/10 text-white placeholder:text-white/50 h-12"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading}
              className="absolute right-1.5 top-1.5 bg-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:via-purple-500 hover:to-pink-500 h-9 w-9 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
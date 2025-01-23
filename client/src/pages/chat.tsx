import { useState } from 'react';
import { GradientBackground } from '@/components/layout/gradient-background';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    return <strong className="font-semibold">{line}</strong>;
  }

  // Format titles (lines ending with ":")
  if (line.endsWith(':')) {
    return <strong className="font-semibold">{line}</strong>;
  }

  // Format proper nouns (words starting with capital letters)
  return line.split(' ').map((word, i) => {
    if (word.match(/^[A-Z][a-z]{2,}/)) {
      return <span key={i}><strong className="font-semibold">{word}</strong>{' '}</span>;
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
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message 
      }]);
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
    <GradientBackground>
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
                Chat avec le Guru
              </span>
            </CardTitle>
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
                        className={`max-w-[80%] rounded-2xl px-6 py-3 shadow-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500/80 to-orange-500/80 text-white'
                            : 'bg-white/10 text-white border border-white/10'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-light text-justify">
                          {message.role === 'assistant' 
                            ? message.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-2 last:mb-0 leading-relaxed">
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
                      <div className="bg-white/10 rounded-2xl px-6 py-3 border border-white/10">
                        <Loader2 className="h-5 w-5 animate-spin text-white/70" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pose ta question au Guru..."
                className="pr-24 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="absolute right-1.5 top-1.5 bg-gradient-to-r from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 h-9"
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
    </GradientBackground>
  );
}
"use client";

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Play, Download, Eye, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeExampleProps {
  title: string;
  description?: string;
  language: string;
  code: string;
  preview?: React.ReactNode;
  downloadable?: boolean;
  runnable?: boolean;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
}

export function CodeExample({
  title,
  description,
  language,
  code,
  preview,
  downloadable = false,
  runnable = false,
  category,
  difficulty = 'Beginner',
  tags = []
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (lang: string) => {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      json: 'json',
      yaml: 'yml',
      markdown: 'md'
    };
    return extensions[lang] || 'txt';
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              <Badge className={getDifficultyColor(difficulty)}>
                {difficulty}
              </Badge>
              {category && (
                <Badge variant="outline">{category}</Badge>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mb-3">{description}</p>
            )}
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <Badge key={`${title}-${tag}`} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            {downloadable && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
            {runnable && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Run
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            {preview && (
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="code" className="mt-4">
            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <Badge variant="outline" className="text-xs">
                  {language}
                </Badge>
              </div>
              
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : '300px' }}
                className="overflow-hidden"
              >
                <pre className="bg-black/20 rounded-lg p-4 overflow-x-auto text-sm">
                  <code className={`language-${language}`}>
                    {code}
                  </code>
                </pre>
              </motion.div>
              
              {code.split('\n').length > 15 && (
                <div className="flex justify-center mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs"
                  >
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {preview && (
            <TabsContent value="preview" className="mt-4">
              <div className="border border-border rounded-lg p-4 bg-background/50">
                {preview}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </GlassCard>
  );
}

// Multi-example showcase component
interface CodeExampleShowcaseProps {
  title: string;
  description?: string;
  examples: CodeExampleProps[];
}

export function CodeExampleShowcase({
  title,
  description,
  examples
}: CodeExampleShowcaseProps) {
  const [selectedExample, setSelectedExample] = useState(0);
  const [filter, setFilter] = useState<string>('all');

  const filteredExamples = examples.filter(example => 
    filter === 'all' || 
    example.language === filter || 
    example.category === filter ||
    example.difficulty === filter
  );

  const getUniqueFilters = () => {
    const filters = new Set(['all']);
    examples.forEach(example => {
      filters.add(example.language);
      if (example.category) filters.add(example.category);
      if (example.difficulty) filters.add(example.difficulty);
    });
    return Array.from(filters);
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          {description && (
            <p className="text-muted-foreground mb-4">{description}</p>
          )}
          
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {getUniqueFilters().map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption)}
                className="capitalize"
              >
                {filterOption}
              </Button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Examples Grid */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {filteredExamples.map((example, index) => (
            <motion.div
              key={`${example.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <CodeExample {...example} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
import React from 'react';
import { 
  Shield,
  GitFork,
  Heart,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const About = () => {
  return (
    <div className="pb-12">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">About CryptoVault</h1>
        <div className="mt-3 sm:mt-0 flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/help';
            }}>
              <MessageCircle className="h-4 w-4" />
              Contact
            </a>
          </Button>
        </div>
      </div>
      
      {/* Mission and Overview */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100 mb-4">
                <Shield className="h-4 w-4 mr-1" />
                Privacy-First Cryptography
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Secure, Simple, Transparent Cryptography
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                CryptoVault provides powerful cryptographic tools in an accessible interface, empowering 
                everyone to protect their digital information. We believe strong encryption should be 
                available to all, with no hidden backdoors or compromises.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Our mission is to democratize cryptography by making advanced security techniques understandable 
                and accessible, while maintaining the highest standards of privacy and security.
              </p>
            </div>
            <div className="md:flex-1 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400" 
                alt="Digital security concept" 
                className="rounded-lg max-w-full md:max-w-md" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Core Values */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Our Core Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 inline-flex rounded-full mb-2">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-lg">Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              We believe privacy is a fundamental right. All cryptographic operations happen locally in your 
              browser, and we never store or access your sensitive data or keys.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 inline-flex rounded-full mb-2">
              <BookOpen className="h-5 w-5 text-amber-500" />
            </div>
            <CardTitle className="text-lg">Education</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              We're committed to helping users understand cryptography. Our documentation explains 
              complex concepts in accessible language, empowering informed security decisions.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-green-50 dark:bg-green-900/20 p-2 inline-flex rounded-full mb-2">
              <GitFork className="h-5 w-5 text-green-500" />
            </div>
            <CardTitle className="text-lg">Transparency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Our code is open-source and available for inspection. We use well-established cryptographic 
              algorithms and libraries, never compromising security with proprietary methods.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Technology Stack */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            The technologies powering CryptoVault's secure cryptographic operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 h-24 flex items-center justify-center mb-2">
                <div>
                  <svg viewBox="0 0 24 24" className="h-12 w-12 text-blue-500 mx-auto">
                    <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">React</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">UI Framework</p>
            </div>
            
            <div className="text-center">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 h-24 flex items-center justify-center mb-2">
                <div>
                  <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-700 dark:text-slate-300 mx-auto">
                    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">TailwindCSS</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Styling Framework</p>
            </div>
            
            <div className="text-center">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 h-24 flex items-center justify-center mb-2">
                <div>
                  <svg viewBox="0 0 24 24" className="h-12 w-12 text-blue-700 dark:text-blue-500 mx-auto">
                    <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">TypeScript</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Language</p>
            </div>
            
            <div className="text-center">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 h-24 flex items-center justify-center mb-2">
                <div>
                  <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-900 dark:text-slate-100 mx-auto">
                    <path d="M9.95 13.4v-2.7h4.68v2.7h-4.68zm0 0V24h4.68l.01-10.6H9.95zm15.41-9.19c-.79-1.05-2.82-2.07-4.65-2.15L20.7 0H0v21.78h.8c.69 0 1.88.26 1.88 1.78 0 .15.01.29.02.44h8.93c.11-.31.22-.62.34-.91.52-1.36 1.11-2.55 1.77-3.6.61-.98 1.29-1.87 2.01-2.68.32-.35.65-.69 1-1.02-.35-.33-.68-.67-1-1.02-.72-.81-1.4-1.7-2.01-2.68-.66-1.05-1.26-2.24-1.77-3.6-.46-1.2-.84-2.53-1.13-3.96h12.85c.38 0 .42-.02.62-.28.3-.39.49-1.05.58-1.9.04-.34.06-.71.07-1.1h.01v-.31h-7.63v2.58h4.69z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">Web Crypto API</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cryptography</p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary">HTTPS</Badge>
            <Badge variant="secondary">CSP</Badge>
            <Badge variant="secondary">TanStack Query</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="secondary">Vite</Badge>
            <Badge variant="secondary">Recharts</Badge>
            <Badge variant="secondary">Express.js</Badge>
            <Badge variant="secondary">Zod</Badge>
            <Badge variant="secondary">Lucide Icons</Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Team */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="Alex Johnson" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Alex Johnson</h3>
            <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">Lead Developer & Founder</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Cryptography expert with 10+ years experience in security and privacy solutions.
            </p>
            <div className="flex justify-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="Sophia Chen" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Sophia Chen</h3>
            <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">Security Researcher</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Specializes in algorithm analysis and ensuring our implementations meet the highest security standards.
            </p>
            <div className="flex justify-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="Marcus Rodriguez" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Marcus Rodriguez</h3>
            <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">UX Designer</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Works to make complex cryptographic tools accessible and user-friendly for everyone.
            </p>
            <div className="flex justify-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* License & Acknowledgements */}
      <Card>
        <CardHeader>
          <CardTitle>License & Acknowledgements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Open Source License</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              CryptoVault is released under the MIT License, allowing for free use, modification, and distribution 
              with proper attribution.
            </p>
            <pre className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md text-xs overflow-auto">
              {`MIT License

Copyright (c) 2023 CryptoVault

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
            </pre>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Acknowledgements</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              CryptoVault stands on the shoulders of giants. We're grateful to the following open source projects:
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
              <li>React - UI Framework</li>
              <li>TailwindCSS - Styling Framework</li>
              <li>shadcn/ui - UI Components</li>
              <li>Web Crypto API - Cryptographic operations</li>
              <li>TypeScript - Type safety</li>
              <li>Lucide Icons - Beautiful icon set</li>
              <li>TanStack Query - Data fetching</li>
              <li>Recharts - Data visualization</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col items-start">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Special thanks to our contributors and the broader cryptography community for their valuable feedback and support.
          </p>
          <div className="mt-4">
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Heart className="h-4 w-4 text-red-500" />
                Contribute to CryptoVault
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default About;

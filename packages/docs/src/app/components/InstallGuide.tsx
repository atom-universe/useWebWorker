'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaNpm, FaYarn } from 'react-icons/fa';
import { SiPnpm } from 'react-icons/si';
import { Prism } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SyntaxHighlighter = Prism as any;

interface InstallGuideProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function InstallGuide({ isOpen, onToggle }: InstallGuideProps) {
  const [pkgManager, setPkgManager] = useState<'npm' | 'yarn' | 'pnpm'>('npm');

  const installCmd = useMemo(() => {
    const cmds = {
      npm: 'npm i @atom-universe/use-web-worker',
      yarn: 'yarn add @atom-universe/use-web-worker',
      pnpm: 'pnpm add @atom-universe/use-web-worker',
    };
    return cmds[pkgManager];
  }, [pkgManager]);

  const packageManagers = [
    { key: 'npm', label: 'npm', size: 36, Icon: FaNpm, iconClass: 'text-[#CB3837]' },
    { key: 'yarn', label: 'yarn', size: 24, Icon: FaYarn, iconClass: 'text-[#2C8EBB]' },
    { key: 'pnpm', label: 'pnpm', size: 24, Icon: SiPnpm, iconClass: 'text-[#F69220] w-4 h-4' },
  ] as const;

  const toggleInstallPanel = () => {
    onToggle();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-start gap-2 m-2">
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex-1"
        >
          <button
            className="w-full btn-primary text-lg mr-4"
            aria-expanded={isOpen}
            onClick={toggleInstallPanel}
          >
            Get Started
          </button>
        </motion.a>

        <motion.a
          href="https://github.com/atom-universe/useWebWorker"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="z-20">
            <button className="copy-btn">
              <FaGithub className="copy-btn-icon" />
            </button>
          </div>
        </motion.a>
      </div>

      {/* Install command expandable panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-4 overflow-hidden"
          >
            <div className="glass rounded-lg">
              <div className="px-4 pt-3 text-sm text-gray-300">
                <div className="relative rounded-md overflow-hidden bg-white/5">
                  <div className="grid grid-cols-3 bg-red-500">
                    {packageManagers.map(pm => (
                      <div
                        key={pm.key}
                        className={`h-12 flex items-center justify-center text-xs font-semibold cursor-pointer hover:bg-white/5`}
                        style={{
                          paddingBottom: pkgManager === pm.key ? '0px' : '2px',
                          borderBottom:
                            pkgManager === pm.key ? '2px solid rgba(139, 92, 246, 0.8)' : 'none',
                        }}
                        onClick={() => setPkgManager(pm.key as typeof pkgManager)}
                        title={pm.label}
                      >
                        <div className="py-2 bg-red-900 w-full">
                          <pm.Icon size={pm.size} className={pm.iconClass} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-b-lg overflow-hidden">
                <SyntaxHighlighter
                  language="bash"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    // background: 'transparent',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                  showLineNumbers={false}
                >
                  {installCmd}
                </SyntaxHighlighter>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

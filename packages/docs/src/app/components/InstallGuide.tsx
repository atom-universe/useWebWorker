'use client';

import { useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FaNpm, FaYarn } from 'react-icons/fa';
import { SiPnpm } from 'react-icons/si';
import { Prism } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SyntaxHighlighter = Prism as any;

interface InstallGuideProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function InstallGuide({ isOpen, onToggle }: InstallGuideProps) {
  const installWrapperRef = useRef<HTMLDivElement>(null);
  const installInnerRef = useRef<HTMLDivElement>(null);
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
    { key: 'npm', label: 'npm', Icon: FaNpm, iconClass: 'text-[#CB3837]' },
    { key: 'yarn', label: 'yarn', Icon: FaYarn, iconClass: 'text-[#2C8EBB]' },
    { key: 'pnpm', label: 'pnpm', Icon: SiPnpm, iconClass: 'text-[#F69220] w-4 h-4' },
  ] as const;

  const toggleInstallPanel = () => {
    const wrapper = installWrapperRef.current;
    const inner = installInnerRef.current;
    if (!wrapper || !inner) return;

    if (isOpen) {
      const tl = gsap.timeline();
      tl.to(wrapper, { height: 0, duration: 0.35, ease: 'power2.in' });
    } else {
      const targetHeight = inner.scrollHeight;
      const tl = gsap.timeline();
      tl.to(wrapper, { height: targetHeight, duration: 0.45, ease: 'power2.out' });
    }
    onToggle();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-start space-x-2">
        <button
          className="flex-1 btn-primary text-lg mr-4"
          aria-expanded={isOpen}
          onClick={toggleInstallPanel}
        >
          Get Started
        </button>
      </div>

      {/* Install command expandable panel */}
      <div ref={installWrapperRef} style={{ height: 0, overflow: 'hidden' }} className="mt-4">
        <div ref={installInnerRef} className="glass rounded-lg">
          <div className="px-4 pt-3 text-sm text-gray-300">
            <div className="relative rounded-md overflow-hidden bg-white/5">
              <div className="grid grid-cols-3">
                {packageManagers.map(pm => (
                  <div
                    key={pm.key}
                    className={`mt-2 h-12 flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer hover:bg-white/5`}
                    style={{
                      outline: pkgManager === pm.key ? '2px solid rgba(70, 0, 235, 0.1)' : 'none',
                    }}
                    onClick={() => setPkgManager(pm.key as typeof pkgManager)}
                    title={pm.label}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <pm.Icon size={16} className={pm.iconClass} />
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
                background: 'transparent',
                fontSize: '14px',
                lineHeight: '1.5',
                padding: '16px',
              }}
              showLineNumbers={false}
            >
              {installCmd}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}

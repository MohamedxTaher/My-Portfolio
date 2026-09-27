import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { profile } from '../../data/portfolio';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  WhatsAppIcon,
} from '../foundation/Icons';
import { scrambleText } from '../../lib/scramble';
import { riseIn, staggerParent } from '../../lib/anim';

/**
 * ChannelSection — chapter 06. The closing invitation: opportunity status,
 * primary calls to action (contact / CV / GitHub), and channel rows
 * (email / LinkedIn / GitHub) with a scramble-decode hover and
 * copy-to-clipboard confirmation, plus the CV as a document download.
 */

type Channel = {
  key: string;
  label: string;
  value: string;
  href: string;
  external: boolean;
  copyable: boolean;
  icon: typeof MailIcon;
};

function ChannelRow({ channel, onCopy, copied }: { channel: Channel; onCopy: (channel: Channel) => void; copied: boolean }) {
  const valueRef = useRef<HTMLAnchorElement>(null);

  return (
    <div className="channel-row">
      <div className="channel-meta">
        <span className="mono mono--xs">{channel.label}</span>
        <a
          ref={valueRef}
          className="channel-value"
          href={channel.href}
          target={channel.external ? '_blank' : undefined}
          rel={channel.external ? 'noopener noreferrer' : undefined}
          onPointerEnter={() => {
            if (valueRef.current) scrambleText(valueRef.current, channel.value);
          }}
        >
          {channel.value}
        </a>
      </div>
      <div className="channel-actions">
        <span className="copied" role="status">
          {copied ? <><CheckIcon size={11} /> copied</> : ''}
        </span>
        {channel.copyable ? (
          <button type="button" className="icon-btn" onClick={() => onCopy(channel)} aria-label={`Copy ${channel.label} address`}>
            <CopyIcon size={14} />
          </button>
        ) : null}
        <a
          className="icon-btn"
          href={channel.href}
          target={channel.external ? '_blank' : undefined}
          rel={channel.external ? 'noopener noreferrer' : undefined}
          aria-label={`Open ${channel.label}`}
        >
          <channel.icon size={14} />
        </a>
      </div>
    </div>
  );
}

export function ChannelSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const channels: Channel[] = [
    {
      key: 'email',
      label: 'email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      external: false,
      copyable: true,
      icon: MailIcon,
    },
    {
      key: 'whatsapp',
      label: 'whatsapp',
      value: profile.whatsappDisplay,
      href: profile.whatsapp,
      external: true,
      copyable: true,
      icon: WhatsAppIcon,
    },
    {
      key: 'linkedin',
      label: 'linkedin',
      value: 'linkedin.com/in/mohamed-taherx',
      href: profile.linkedin,
      external: true,
      copyable: false,
      icon: LinkedInIcon,
    },
    {
      key: 'github',
      label: 'github',
      value: 'github.com/MohamedxTaher',
      href: profile.github,
      external: true,
      copyable: false,
      icon: GitHubIcon,
    },
  ];

  const onCopy = async (channel: Channel) => {
    try {
      await navigator.clipboard.writeText(channel.value);
      setCopiedKey(channel.key);
      window.setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      /* clipboard unavailable — the mailto link remains the path */
    }
  };

  return (
    <section id="contact" className="section section--band">
      <div className="container">
        <span className="ghost-num" aria-hidden="true">
          06
        </span>

        <div className="channel">
          <motion.header
            className="channel-head"
            variants={staggerParent(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          >
            <motion.p className="kicker" variants={riseIn}>
              06 // contact
            </motion.p>
            <motion.h2 className="channel-title" variants={riseIn} style={{ marginTop: 'var(--s-4)' }}>
              <span>Get in</span>
              <span className="text-outline">touch</span>
            </motion.h2>
            <motion.div className="channel-note" variants={riseIn}>
              <span className="status status--confirmed">open for opportunities</span>
            </motion.div>
            <motion.p className="lead channel-invite" variants={riseIn}>
              {profile.contactInvite}
            </motion.p>
            <motion.div className="channel-ctas" variants={riseIn}>
              <a className="btn btn--signal" href={`mailto:${profile.email}`}>
                contact me
                <ArrowRightIcon size={14} className="btn-arrow" />
              </a>
              <a className="btn btn--ghost" href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
                whatsapp
                <WhatsAppIcon size={14} />
              </a>
              <a className="btn btn--ghost" href={profile.cvPath} target="_blank" rel="noopener noreferrer">
                download cv
                <DownloadIcon size={14} />
              </a>
              <a className="btn btn--ghost" href={profile.github} target="_blank" rel="noopener noreferrer">
                view github
                <ArrowUpRightIcon size={14} />
              </a>
            </motion.div>
          </motion.header>

          <motion.div
            className="channel-panel panel ticks"
            variants={staggerParent(0.07)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          >
            <div className="channel-list">
              {channels.map((channel) => (
                <motion.div key={channel.key} variants={riseIn}>
                  <ChannelRow channel={channel} onCopy={onCopy} copied={copiedKey === channel.key} />
                </motion.div>
              ))}
              <motion.div className="channel-cv" variants={riseIn}>
                <div className="channel-meta">
                  <span className="mono mono--xs">cv</span>
                  <a
                    className="channel-value"
                    href={profile.cvPath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    download cv (pdf)
                  </a>
                </div>
                <div className="channel-actions">
                  <a
                    className="icon-btn"
                    href={profile.cvPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download CV (PDF)"
                  >
                    <DownloadIcon size={14} />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

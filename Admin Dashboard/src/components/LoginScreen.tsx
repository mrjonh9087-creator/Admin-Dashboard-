import React from 'react';
import { VerifiedBadge } from './VerifiedBadge';
import {
  ShieldCheck,
  Lock,
  FileCode2,
  CreditCard,
  Loader2,
  AlertCircle,
  LogOut
} from 'lucide-react';

interface LoginScreenProps {
  onGoogleLogin: () => Promise<void>;
  onSwitchAccount?: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  deniedEmail?: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onGoogleLogin,
  onSwitchAccount,
  isLoading,
  error,
  deniedEmail
}) => {
  return (
    <div className="min-h-screen lcd-ambient-bg text-slate-100 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 lcd-card rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Brand & Security Capabilities Column */}
        <div className="lg:col-span-6 p-8 sm:p-10 bg-[#0b1120] border-b lg:border-b-0 lg:border-r border-cyan-400/15 flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/aistudio/IMG_1928_acf6f505_acf6f505.jpeg"
                alt="Benzto2 VIP"
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-2xl object-cover border border-cyan-400/40 shadow-[0_0_14px_rgba(56,189,248,0.3)]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-white tracking-tight">
                    Benzto2 Admin Console
                  </span>
                  <VerifiedBadge size="md" title="Official Verified Admin" />
                </div>
                <div className="text-xs font-mono text-cyan-400/80">
                  @Benzto2_VIP_Bot · Operations
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <h1 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-snug">
                ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធលក់ iOS VPN & .mobileconfig
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                ចូលប្រើប្រាស់ដោយសុវត្ថិភាពតាមគណនី Google (Gmail) ដើម្បីត្រួតពិនិត្យការបញ្ជាទិញ KHQR និងគ្រប់គ្រងសិទ្ធិ NextDNS អតិថិជន។
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    ត្រួតពិនិត្យ Slip ACLEDA KHQR ផ្ទាល់
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    អនុម័តការបញ្ជាទិញ និងផ្ញើឯកសារជូនអតិថិជនភ្លាមៗ
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <FileCode2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    បង្កើត .mobileconfig ស្វ័យប្រវត្តិ
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    តភ្ជាប់ជាមួយ NextDNS VIP និង Telegram sendDocument
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    ការពារសុវត្ថិភាព Admin Whitelist
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    អនុញ្ញាតឱ្យចូលប្រើតែគណនី Gmail ដែលបានកំណត់ប៉ុណ្ណោះ
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>com.benzto2.admin</span>
            <span>Protected by Google Auth</span>
          </div>
        </div>

        {/* Right Sign-In Action Column */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center">
          {deniedEmail ? (
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                <Lock className="w-5 h-5" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">គ្មានសិទ្ធិចូលប្រើប្រាស់</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  គណនី{' '}
                  <span className="font-mono text-white font-semibold">{deniedEmail}</span>{' '}
                  មិនទាន់មានឈ្មោះក្នុងបញ្ជី Admin ដែលអនុញ្ញាតទេ។ សូមប្រើប្រាស់គណនី Gmail របស់ម្ចាស់ប្រព័ន្ធ ឬស្នើសុំសិទ្ធិពី Super Admin។
                </p>
              </div>

              {onSwitchAccount && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onSwitchAccount}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span>ប្តូរគណនី Google (Switch Gmail)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Authentication</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  ចូលគណនី Admin របស់អ្នក
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ចុចប៊ូតុងខាងក្រោមដើម្បីផ្ទៀងផ្ទាត់អត្តសញ្ញាណជាមួយគណនី Google (Gmail) របស់អ្នក។
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                disabled={isLoading}
                onClick={onGoogleLogin}
                className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold transition-colors shadow-lg disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                    <span>កំពុងផ្ទៀងផ្ទាត់ Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                      />
                    </svg>
                    <span>ចូលដោយប្រើ Google (Gmail)</span>
                  </>
                )}
              </button>

              <div className="p-3.5 rounded-xl bg-[#090d16] border border-white/[0.08] text-[11px] text-slate-400 leading-relaxed">
                ប្រព័ន្ធប្រើប្រាស់ Firebase Google OAuth 2.0 ដោយមិនរក្សាទុកពាក្យសម្ងាត់ Gmail របស់អ្នកឡើយ។
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

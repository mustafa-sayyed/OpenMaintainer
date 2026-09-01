import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CircleDot,
  Hash,
  MoreHorizontal,
  ShieldCheck,
} from 'lucide-react';

const githubUrl = 'https://github.com/mustafa-sayyed/OpenMaintainer';
const appUrl = 'https://github.com/apps/openmaintainerai';
const mono = 'font-mono text-xs uppercase tracking-[0.09em]';

export default function Home() {
  return (
    <main className="overflow-hidden">
      <nav
        className="mx-auto flex h-[84px] w-[calc(100%-4rem)] max-w-[1160px] items-center justify-between border-b border-om-line"
        aria-label="Main navigation"
      >
        <a
          className="flex items-center text-2xl gap-2.5 font-bold tracking-[-0.04em]"
          href="#top"
          aria-label="OpenMaintainer home"
        >
          <span>OpenMaintainer</span>
        </a>
        <div className="ml-auto mr-9 hidden gap-8 text-sm text-[#59665f] md:flex">
          <a
            className="transition-colors hover:text-om-orange!"
            href="#how-it-works"
          >
            How it works
          </a>
          <a
            className="transition-colors hover:text-om-orange!"
            href="#principles"
          >
            Principles
          </a>
          <a
            className="transition-colors hover:text-om-orange! flex items-center gap-1.5"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={14} />
          </a>
        </div>
        <a
          className="inline-flex items-center gap-2 bg-om-orange px-5 py-3.5 text-sm font-semibold text-white! transition hover:-translate-y-0.5 hover:bg-om-ink"
          href={appUrl}
          target="_blank"
          rel="noreferrer"
        >
          Install app <ArrowUpRight size={16} />
        </a>
      </nav>

      <section
        className="mx-auto grid min-h-[650px] w-[calc(100%-4rem)] max-w-[1160px] items-center gap-16 py-[75px] pb-[90px] lg:grid-cols-[1fr_1fr]"
        id="top"
      >
        <div className="mb-14 lg:mb-0">
          <p className={`${mono} mb-6 text-om-orange flex items-center`}>
            <span className="mr-2 inline-block size-[7px] rounded-full bg-om-orange align-[1px] shadow-[0_0_0_5px_#f26b4220]" />
            Autonomous maintenance for open source
          </p>
          <h1 className="text-[clamp(55px,6vw,82px)] font-semibold leading-[.94] tracking-[-0.075em]">
            Your repo deserves
            <br />
            <em className="not-italic text-om-orange">a co-maintainer.</em>
          </h1>
          <p className="my-7 max-w-[400px] text-base leading-[1.6] text-om-muted">
            OpenMaintainer handles the routine work on GitHub, guided by
            policies you define. Less tab-switching. More time for the work only
            you can do.
          </p>
          <div className="flex items-center gap-7">
            <a
              className="inline-flex items-center gap-2 bg-om-orange px-5 py-4 text-sm font-semibold text-white! transition hover:-translate-y-0.5 hover:bg-om-ink"
              href={appUrl}
              target="_blank"
              rel="noreferrer"
            >
              Add to GitHub <ArrowUpRight size={16} />
            </a>
            <a
              className="inline-flex items-center gap-1.5 border-b border-om-ink pb-1 text-sm font-semibold transition-colors hover:border-om-orange hover:text-om-orange!"
              href="#how-it-works"
            >
              See how it works <ArrowDown size={15} />
            </a>
          </div>
          <p className={`${mono} mt-9 text-[#8a938d]`}>
            Open source · Policy-controlled · Built for maintainers
          </p>
        </div>
        <div
          className="relative grid min-h-[455px] place-items-center overflow-hidden border border-[#d2d8ce] bg-[#e4e8df] before:absolute before:inset-0 before:opacity-35 before:bg-[linear-gradient(#cad3c6_1px,transparent_1px),linear-gradient(90deg,#cad3c6_1px,transparent_1px)] before:bg-[length:32px_32px]"
          aria-label="OpenMaintainer triaging a GitHub issue according to repository policy"
        >
          <div className="absolute size-[510px] rounded-full border border-[#b9c3b7]" />
          <div className="absolute size-[350px] rotate-35 scale-x-50 rounded-full border border-[#c4ccc1]" />
          <div className="relative z-10 w-[78%] max-w-[410px] animate-[rise_.8s_ease_both] border border-om-ink bg-[#fffefa] shadow-[9px_10px_0_#17221e]">
            <div className="flex items-center gap-2 border-b border-om-line px-4 py-3.5 text-[11px]">
              <span>
                OpenMaintainer{' '}
                <b className="font-medium text-om-orange">is thinking...</b>
              </span>
              <MoreHorizontal className="ml-auto text-[#a3aba4]" size={18} />
            </div>
            <div className="flex items-center gap-3 px-5 pb-3 pt-[22px]">
              <span className="grid size-7 place-items-center bg-om-ink text-white">
                <Hash size={16} />
              </span>
              <div>
                <strong className="block text-sm">Issue triage</strong>
                <small className="mt-1 block text-xs text-om-muted">
                  mustafa-sayyed / OpenMaintainer
                </small>
              </div>
              <span className="ml-auto bg-[#5bc266] text-white px-2 py-1 font-mono text-[9px] uppercase tracking-[0.09em]">
                ACTIVE
              </span>
            </div>
            <div className="mx-5 mb-[15px] bg-[#f0f1eb] p-3.5 text-[13px] leading-[1.5] text-[#4e5d53]">
              I found a likely duplicate and checked the repository policy
              before taking action.
            </div>
            <div className="mx-5 mb-[21px] flex items-center gap-3">
              <span className="grid size-[25px] place-items-center rounded-full bg-[#5bc266] font-bold text-white">
                <Check size={15} />
              </span>
              <div>
                <strong className="block text-sm">Action approved</strong>
                <small className="mt-1 block text-xs text-om-muted">
                  Comment with related issue · confidence 94%
                </small>
              </div>
            </div>
            <div
              className={`${mono} flex justify-between border-t border-om-line px-4 py-3 text-[8px] text-[#89948b]`}
            >
              <span>policy / maintainer.yml</span>
              <span>just now</span>
            </div>
          </div>
          <div className="absolute right-[4%] top-[54px] z-20 rotate-1 border border-om-ink bg-om-paper px-3 py-2.5 font-mono text-[10px] shadow-[4px_4px_0_#17221e]">
            <ShieldCheck className="mr-1 inline text-om-orange" size={15} />
            Your rules, always
          </div>
          <div className="absolute bottom-[58px] left-[4%] z-20 -rotate-1 border border-om-ink bg-om-paper px-3 py-2.5 font-mono text-[10px] shadow-[4px_4px_0_#17221e]">
            <Check className="mr-1 inline text-om-orange" size={15} />
            No action without approval
          </div>
        </div>
      </section>

      <section
        className="mx-auto flex min-h-[78px] w-[calc(100%-4rem)] max-w-[1160px] items-center justify-between gap-5 border-y border-om-line max-md:block max-md:py-5"
        aria-label="OpenMaintainer capabilities"
      >
        <span className={`${mono} text-om-orange`}>
          One agent. The boring bits handled.
        </span>
        <div
          className={`${mono} mt-3 flex flex-wrap items-center gap-4 text-[#748078] md:mt-0`}
        >
          <span>ISSUE TRIAGE</span>
          <i className="size-[5px] rounded-full border border-om-ink bg-om-lime" />
          <span>DEPENDABOT PRs</span>
          <i className="size-[5px] rounded-full border border-om-ink bg-om-lime" />
          <span>POLICY CHECKS</span>
          <i className="size-[5px] rounded-full border border-om-ink bg-om-lime" />
          <span>GITHUB NATIVE</span>
        </div>
      </section>

      <section
        className="mx-auto w-[calc(100%-4rem)] max-w-[1160px] py-[130px] max-md:py-[85px]"
        id="how-it-works"
      >
        <div className="flex items-end justify-between border-b border-om-line pb-[58px] max-md:block max-md:pb-[38px]">
          <p className={`${mono} text-om-orange`}>
            A calm layer between signal and action
          </p>
          <h2 className="mt-9 text-[clamp(43px,5vw,64px)] font-semibold leading-[.94] tracking-[-0.075em] md:mt-0">
            It acts like a maintainer.
            <br />
            <em className="not-italic text-om-orange">
              Because it follows one.
            </em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <article className="border-b border-om-line py-[30px] md:mr-[46px] md:border-b-0 md:border-r md:pb-0 md:pt-[38px]">
            <span className={`${mono} text-om-orange`}>01</span>
            <h3 className="mb-3 mt-[34px] text-[25px] tracking-[-0.05em]">
              Listen
            </h3>
            <p className="max-w-[270px] text-sm leading-[1.6] text-om-muted">
              GitHub activity arrives securely. OpenMaintainer knows what
              changed and why it matters.
            </p>
          </article>
          <article className="border-b border-om-line py-[30px] md:mr-[46px] md:border-b-0 md:border-r md:pb-0 md:pt-[38px]">
            <span className={`${mono} text-om-orange`}>02</span>
            <h3 className="mb-3 mt-[34px] text-[25px] tracking-[-0.05em]">
              Understand
            </h3>
            <p className="max-w-[270px] text-sm leading-[1.6] text-om-muted">
              It reads the issue, searches for context, and reasons through the
              repository&apos;s conventions.
            </p>
          </article>
          <article className="py-[30px] md:pt-[38px]">
            <span className={`${mono} text-om-orange`}>03</span>
            <h3 className="mb-3 mt-[34px] text-[25px] tracking-[-0.05em]">
              Act carefully
            </h3>
            <p className="max-w-[270px] text-sm leading-[1.6] text-om-muted">
              Every comment, label, close, or merge passes through your
              maintainer policy first.
            </p>
          </article>
        </div>
      </section>

      <section
        className="grid w-full grid-cols-1 gap-16 bg-om-ink px-8 py-20 text-om-paper md:grid-cols-2 md:gap-20 md:px-[max(32px,calc((100%_-_1096px)_/_2))] md:py-[115px]"
        id="principles"
      >
        <div>
          <p className={`${mono} text-om-lime`}>The OpenMaintainer way</p>
          <h2 className="mt-6 text-[clamp(43px,5vw,64px)] font-semibold leading-[.94] tracking-[-0.075em]">
            Autonomy with
            <br />
            <em className="not-italic text-om-orange">guardrails.</em>
          </h2>
        </div>
        <div>
          <div className="grid grid-cols-[40px_1fr] border-t border-[#526058] py-6">
            <span className={`${mono} text-om-lime`}>01</span>
            <strong className="text-lg font-medium">Useful by default</strong>
            <p className="col-start-2 mt-2 max-w-[270px] text-sm leading-[1.6] text-[#b4c0b8]">
              Routine work gets done without adding another dashboard to your
              day.
            </p>
          </div>
          <div className="grid grid-cols-[40px_1fr] border-t border-[#526058] py-6">
            <span className={`${mono} text-om-lime`}>02</span>
            <strong className="text-lg font-medium">
              Transparent by design
            </strong>
            <p className="col-start-2 mt-2 max-w-[270px] text-sm leading-[1.6] text-[#b4c0b8]">
              Actions are grounded in visible policy and clear reasoning.
            </p>
          </div>
          <div className="grid grid-cols-[40px_1fr] border-t border-[#526058] py-6">
            <span className={`${mono} text-om-lime`}>03</span>
            <strong className="text-lg font-medium">Yours to shape</strong>
            <p className="col-start-2 mt-2 max-w-[270px] text-sm leading-[1.6] text-[#b4c0b8]">
              Start with sensible defaults. Tune the rules as your community
              grows.
            </p>
          </div>
        </div>
      </section>

      <footer className="mx-auto grid min-h-[115px] w-[calc(100%-4rem)] max-w-[1160px] grid-cols-2 items-center gap-6 py-7 md:flex md:justify-between">
        <a
          className="flex items-center text-2xl gap-2.5 font-bold tracking-[-0.04em]"
          href="#top"
        >
          <span>OpenMaintainer</span>
        </a>
        <p className="col-span-2 row-start-2 text-sm text-om-muted md:order-2">
          Open source maintenance, with a little more breathing room.
        </p>
        <div className="flex flex-col items-end gap-2 font-mono text-[10px] uppercase md:order-3 md:flex-row md:gap-5">
          <a
            className="hover:text-om-orange! flex items-center gap-1"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>Source</span>
            <ArrowUpRight size={14}  className='-mt-0.5' />
          </a>
          <a
            className="hover:text-om-orange! flex items-center gap-1"
            href={appUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>GitHub App</span>
             <ArrowUpRight size={14} className='-mt-0.5' />
          </a>
        </div>
      </footer>
    </main>
  );
}

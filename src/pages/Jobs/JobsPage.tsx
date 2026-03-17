import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import {
    HiOutlineLocationMarker,
    HiOutlineBriefcase,
    HiOutlineCalendar,
    HiOutlineRefresh,
    HiOutlineExternalLink,
    HiOutlineOfficeBuilding,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineX,
    HiOutlineDocumentText,
} from 'react-icons/hi';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiJob {
    id: number;
    job_title: string;
    company_name: string;
    company_logo?: string;
    company_url?: string;
    location: string;
    date_posted: string;
    url: string;
    description?: string;
    employment_type?: string;
    remote?: boolean;
    country_code?: string;
}

interface ApiResponse {
    data: ApiJob[];
    total?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;
const API_URL = 'https://api.theirstack.com/v1/jobs/search';
const API_KEY = import.meta.env.VITE_THEIRSTACK_API_KEY as string;

function buildPayload(page: number, search: string) {
    return {
        include_total_results: false,
        posted_at_max_age_days: 15,
        job_location_or: [{ id: 2328926 }],
        job_title_or: search.trim() ? [search.trim()] : ['health'],
        job_location_not: [{ id: 2334797 }],
        page,
        limit: PAGE_SIZE,
        blur_company_data: false,
    };
}

// Module-level cache — persists across navigations, cleared only on explicit Refresh
interface CacheEntry { jobs: ApiJob[]; hasMore: boolean; }
const jobsCache = new Map<string, CacheEntry>();
const cacheKey = (page: number, query: string) => `${page}::${query.trim().toLowerCase()}`;

function formatDate(dateStr: string) {
    if (!dateStr) return 'Recently posted';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
}

// ─── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm animate-pulse">
            <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-surface-200 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-surface-200" />
                    <div className="h-3 w-1/2 rounded bg-surface-100" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-surface-100" />
                <div className="h-3 w-5/6 rounded bg-surface-100" />
                <div className="h-3 w-2/3 rounded bg-surface-100" />
            </div>
            <div className="mt-4 h-8 w-24 rounded-lg bg-surface-200" />
        </div>
    );
}

// ─── Job Description Modal ────────────────────────────────────────────────────
function JobModal({ job, onClose }: { job: ApiJob; onClose: () => void }) {
    const [imgErr, setImgErr] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', animation: 'idcard-fade-in 0.2s ease-out' }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
                style={{ animation: 'idcard-fade-in 0.25s ease-out' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal header */}
                <div className="flex items-start gap-4 border-b border-surface-100 px-6 py-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-50 ring-1 ring-surface-200 overflow-hidden">
                        {job.company_logo && !imgErr ? (
                            <img
                                src={job.company_logo}
                                alt={job.company_name}
                                className="h-full w-full object-contain p-1.5"
                                onError={() => setImgErr(true)}
                            />
                        ) : (
                            <HiOutlineOfficeBuilding className="h-7 w-7 text-surface-400" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-surface-900 leading-snug">{job.job_title}</h2>
                        <p className="mt-0.5 text-sm font-medium text-primary-600">{job.company_name}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-500">
                            {job.location && (
                                <span className="flex items-center gap-1">
                                    <HiOutlineLocationMarker className="h-3.5 w-3.5" />
                                    {job.location}
                                </span>
                            )}
                            {job.employment_type && (
                                <span className="flex items-center gap-1">
                                    <HiOutlineBriefcase className="h-3.5 w-3.5" />
                                    {job.employment_type}
                                </span>
                            )}
                            {job.date_posted && (
                                <span className="flex items-center gap-1">
                                    <HiOutlineCalendar className="h-3.5 w-3.5" />
                                    {formatDate(job.date_posted)}
                                </span>
                            )}
                            {job.remote && (
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200">
                                    Remote
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
                    >
                        <HiOutlineX className="h-5 w-5" />
                    </button>
                </div>

                {/* Description body — scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {job.description ? (
                        <div className="prose prose-sm max-w-none text-surface-700 leading-relaxed whitespace-pre-line">
                            {job.description}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-10 text-center text-surface-400">
                            <HiOutlineDocumentText className="h-10 w-10 mb-3" />
                            <p className="text-sm">No description available for this position.</p>
                        </div>
                    )}
                </div>

                {/* Footer with Apply button */}
                <div className="flex items-center justify-between border-t border-surface-100 bg-surface-50/60 px-6 py-4">
                    <span className="text-xs text-surface-400">
                        Posted {formatDate(job.date_posted)}
                    </span>
                    <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/20 transition-all hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 active:scale-95"
                    >
                        Apply for this Job
                        <HiOutlineExternalLink className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, onViewDescription }: { job: ApiJob; onViewDescription: (job: ApiJob) => void }) {
    const [imgErr, setImgErr] = useState(false);

    return (
        <Card hover className="flex flex-col gap-0 p-0 overflow-hidden group">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="p-2 flex flex-col flex-1">
                {/* Company + logo */}
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-50 ring-1 ring-surface-100 overflow-hidden shadow-sm">
                        {job.company_logo && !imgErr ? (
                            <img
                                src={job.company_logo}
                                alt={job.company_name}
                                className="h-full w-full object-contain p-1.5"
                                onError={() => setImgErr(true)}
                            />
                        ) : (
                            <HiOutlineOfficeBuilding className="h-6 w-6 text-surface-400" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-surface-900 leading-snug line-clamp-2">
                            {job.job_title}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-primary-600 truncate">
                            {job.company_name}
                        </p>
                    </div>
                </div>

                {/* Badges row */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.location && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-2.5 py-1 text-xs text-surface-600">
                            <HiOutlineLocationMarker className="h-3 w-3 text-surface-400" />
                            {job.location}
                        </span>
                    )}
                    {job.employment_type && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                            <HiOutlineBriefcase className="h-3 w-3" />
                            {job.employment_type}
                        </span>
                    )}
                    {job.remote && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-100">
                            Remote
                        </span>
                    )}
                </div>

                {/* Short excerpt */}
                {job.description && (
                    <p className="mt-3 text-xs text-surface-500 leading-relaxed line-clamp-2 flex-1">
                        {job.description}
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-surface-100 px-5 py-3 bg-surface-50/50">
                <span className="flex items-center gap-1 text-xs text-surface-400">
                    <HiOutlineCalendar className="h-3.5 w-3.5" />
                    {formatDate(job.date_posted)}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onViewDescription(job)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs font-medium text-surface-600 shadow-sm transition-all hover:border-primary-300 hover:text-primary-700 hover:shadow active:scale-95"
                    >
                        <HiOutlineDocumentText className="h-3.5 w-3.5" />
                        Description
                    </button>
                </div>
            </div>
        </Card>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function JobsPage() {
    const [jobs, setJobs] = useState<ApiJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [selectedJob, setSelectedJob] = useState<ApiJob | null>(null);

    const fetchJobs = useCallback(async (currentPage: number, query: string, bustCache = false) => {
        const key = cacheKey(currentPage, query);

        // Return cached result immediately — no network call needed
        if (!bustCache && jobsCache.has(key)) {
            const cached = jobsCache.get(key)!;
            setJobs(cached.jobs);
            setHasMore(cached.hasMore);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify(buildPayload(currentPage, query)),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`API error ${res.status}: ${text}`);
            }

            const json: ApiResponse = await res.json();
            const results = json.data ?? [];
            const more = results.length === PAGE_SIZE;

            // Store in cache
            jobsCache.set(key, { jobs: results, hasMore: more });

            setJobs(results);
            setHasMore(more);
        } catch (err: unknown) {
            console.error('Jobs fetch error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Explicit refresh: busts only the current page/query cache key
    const forceRefresh = useCallback(() => {
        jobsCache.delete(cacheKey(page, search));
        fetchJobs(page, search, true);
    }, [page, search, fetchJobs]);

    useEffect(() => {
        fetchJobs(page, search);
    }, [page, search, fetchJobs]);



    const handleClear = () => {
        setSearch('');
        setPage(0);
    };

    const handlePrev = () => {
        if (page > 0) setPage((p) => p - 1);
    };

    const handleNext = () => {
        if (hasMore) setPage((p) => p + 1);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-50/40 via-surface-50 to-surface-50">
            {/* Job description modal */}
            {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
            {/* Hero header */}


            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Status bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {search && (
                            <span className="text-sm text-surface-600">
                                Results for <span className="font-semibold text-surface-900">"{search}"</span>
                            </span>
                        )}
                        {!loading && !error && (
                            <span className="text-sm text-surface-400">
                                {jobs.length === 0 ? 'No jobs found' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} on this page`}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={forceRefresh}
                        disabled={loading}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-surface-500 hover:bg-surface-100 transition-colors disabled:opacity-40"
                    >
                        <HiOutlineRefresh className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Error state */}
                {error && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                        <p className="text-sm font-medium text-red-700">{error}</p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="mt-4"
                            onClick={forceRefresh}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Loading skeletons */}
                {loading && !error && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Jobs grid */}
                {!loading && !error && jobs.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} onViewDescription={setSelectedJob} />
                        ))}

                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && jobs.length === 0 && (
                    <div className="mt-16 flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-100">
                            <HiOutlineBriefcase className="h-10 w-10 text-surface-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-surface-800">No jobs found</h3>
                        <p className="mt-1 text-sm text-surface-500">
                            Try adjusting your search or check back soon for new postings.
                        </p>
                        <Button variant="ghost" className="mt-4" onClick={handleClear}>
                            Clear search
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && (jobs.length > 0 || page > 0) && (
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={page === 0}
                            className="flex items-center gap-1.5 rounded-xl border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-surface-600 shadow-sm transition-all hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <HiOutlineChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                        <span className="text-sm text-surface-500">
                            Page {page + 1}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={!hasMore}
                            className="flex items-center gap-1.5 rounded-xl border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-surface-600 shadow-sm transition-all hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <HiOutlineChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

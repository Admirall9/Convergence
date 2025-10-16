import { create } from 'zustand';
import { fetchSpendingAggregate } from './budgetAPI';
export const useBudgetStore = create((set, get) => ({
    year: new Date().getFullYear(),
    region: undefined,
    ministry: undefined,
    loading: false,
    error: undefined,
    data: null,
    setYear: (y) => set({ year: y }),
    setRegion: (r) => set({ region: r }),
    setMinistry: (m) => set({ ministry: m }),
    load: async () => {
        const { year, region, ministry } = get();
        set({ loading: true, error: undefined });
        try {
            const data = await fetchSpendingAggregate(year, region, ministry);
            set({ data });
        }
        catch (e) {
            set({ error: e?.message || 'Failed to load spending data' });
        }
        finally {
            set({ loading: false });
        }
    },
}));

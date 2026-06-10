import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as aiService from '../services/aiService.js';
import { createExpense } from '../services/expenseService.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const todayISO = () => new Date().toISOString().split('T')[0];

const BLANK_FORM = {
    amount: '',
    category: '',
    description: '',
    date: '',           // filled dynamically on init and reset
    payer: '',          // user ID — relevant for group expenses
    participants: [],   // user IDs — relevant for group expenses
    groupId: null,
    type: 'personal',   // 'personal' | 'group'
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

// Parse natural language text into structured expense fields
export const parseExpenseFromText = createAsyncThunk(
    'ai/parseExpenseFromText',
    async ({ text, groupId = null }, { rejectWithValue }) => {
        try {
            return await aiService.parseExpenseText(text, groupId);
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to parse expense');
        }
    }
);

// Submit a fully-formed expense (AI-populated or manually edited)
export const submitAIExpense = createAsyncThunk(
    'ai/submitExpense',
    async (expenseData, { rejectWithValue }) => {
        try {
            return await createExpense(expenseData);
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to submit expense');
        }
    }
);

// Extract amount/description/date from a base64 bill image
export const scanBill = createAsyncThunk(
    'ai/scanBill',
    async ({ image, mimeType = 'image/jpeg' }, { rejectWithValue }) => {
        try {
            return await aiService.scanBillImage(image, mimeType);
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to scan bill');
        }
    }
);

// Fetch AI-generated spending insights for the logged-in user
export const fetchPersonalAnalysis = createAsyncThunk(
    'ai/fetchPersonalAnalysis',
    async (_, { rejectWithValue }) => {
        try {
            return await aiService.analysePersonalExpenses();
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch spending analysis');
        }
    }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
    // 'manual' | 'ai' | 'voice' | 'scan'
    inputMode: 'manual',

    // Shared expense form fields populated by AI or the user
    form: { ...BLANK_FORM, date: todayISO() },

    // Natural language text input (typed or spoken) used for AI parsing
    parse: {
        loading: false,
        error: null,
        rawText: '',
    },

    // Bill image scan result
    scan: {
        loading: false,
        error: null,
        sentence: null,   // human-readable summary from the scanner
    },

    // Expense submission
    submit: {
        loading: false,
        error: null,
        success: false,
    },

    // AI spending insights
    analysis: {
        loading: false,
        error: null,
        data: null,
    },

    // Voice recording state (managed here so components can read it from Redux)
    voice: {
        isRecording: false,
        transcript: '',
        supported: null,  // null = not yet checked, true/false after feature detection
    },
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        // Switch between input modes
        setInputMode(state, action) {
            state.inputMode = action.payload;
        },

        // Update a single form field
        updateField(state, action) {
            const { field, value } = action.payload;
            if (Object.prototype.hasOwnProperty.call(state.form, field)) {
                state.form[field] = value;
            }
        },

        // Add or remove a participant by user ID
        toggleParticipant(state, action) {
            const userId = action.payload;
            const idx = state.form.participants.indexOf(userId);
            if (idx === -1) {
                state.form.participants.push(userId);
            } else {
                state.form.participants.splice(idx, 1);
            }
        },

        // Update the raw text that will be sent to the AI parser
        setRawText(state, action) {
            state.parse.rawText = action.payload;
        },

        // Called by useVoiceInput when a final transcript arrives
        setVoiceTranscript(state, action) {
            state.voice.transcript = action.payload;
            state.parse.rawText = action.payload;
        },

        // Reflect microphone recording state in Redux
        setVoiceRecording(state, action) {
            state.voice.isRecording = action.payload;
        },

        // Set once after feature-detection in useVoiceInput
        setVoiceSupported(state, action) {
            state.voice.supported = action.payload;
        },

        // Reset form + transient AI state back to defaults
        resetForm(state) {
            state.form = { ...BLANK_FORM, date: todayISO() };
            state.parse.rawText = '';
            state.scan.sentence = null;
            state.voice.transcript = '';
            state.voice.isRecording = false;
        },

        // Granular error clearers
        clearParseError(state) {
            state.parse.error = null;
        },
        clearScanError(state) {
            state.scan.error = null;
        },
        resetSubmitStatus(state) {
            state.submit.loading = false;
            state.submit.error = null;
            state.submit.success = false;
        },
        clearAnalysis(state) {
            state.analysis.data = null;
            state.analysis.error = null;
        },
        clearErrors(state) {
            state.parse.error = null;
            state.scan.error = null;
            state.submit.error = null;
            state.analysis.error = null;
        },
    },

    extraReducers: (builder) => {
        // ── parseExpenseFromText ──────────────────────────────────────────────
        builder
            .addCase(parseExpenseFromText.pending, (state) => {
                state.parse.loading = true;
                state.parse.error = null;
            })
            .addCase(parseExpenseFromText.fulfilled, (state, action) => {
                state.parse.loading = false;
                const p = action.payload;
                if (!p) return;
                // Merge parsed fields into the form; keep existing values as fallback
                if (p.amount != null) state.form.amount = String(p.amount);
                if (p.category)       state.form.category = p.category;
                if (p.description)    state.form.description = p.description;
                if (p.date)           state.form.date = p.date;
                if (p.payer)          state.form.payer = p.payer;
                if (Array.isArray(p.participants) && p.participants.length > 0) {
                    state.form.participants = p.participants;
                }
            })
            .addCase(parseExpenseFromText.rejected, (state, action) => {
                state.parse.loading = false;
                state.parse.error = action.payload;
            });

        // ── submitAIExpense ───────────────────────────────────────────────────
        builder
            .addCase(submitAIExpense.pending, (state) => {
                state.submit.loading = true;
                state.submit.error = null;
                state.submit.success = false;
            })
            .addCase(submitAIExpense.fulfilled, (state) => {
                state.submit.loading = false;
                state.submit.success = true;
                // Reset the form after a successful submission
                state.form = { ...BLANK_FORM, date: todayISO() };
                state.parse.rawText = '';
                state.scan.sentence = null;
                state.voice.transcript = '';
            })
            .addCase(submitAIExpense.rejected, (state, action) => {
                state.submit.loading = false;
                state.submit.error = action.payload;
                state.submit.success = false;
            });

        // ── scanBill ──────────────────────────────────────────────────────────
        builder
            .addCase(scanBill.pending, (state) => {
                state.scan.loading = true;
                state.scan.error = null;
                state.scan.sentence = null;
            })
            .addCase(scanBill.fulfilled, (state, action) => {
                state.scan.loading = false;
                const s = action.payload;
                if (!s) return;
                state.scan.sentence = s.sentence ?? null;
                // Pre-fill form from scanned data; user can still edit
                if (s.amount != null) state.form.amount = String(s.amount);
                if (s.description)    state.form.description = s.description;
                if (s.date)           state.form.date = s.date;
            })
            .addCase(scanBill.rejected, (state, action) => {
                state.scan.loading = false;
                state.scan.error = action.payload;
            });

        // ── fetchPersonalAnalysis ─────────────────────────────────────────────
        builder
            .addCase(fetchPersonalAnalysis.pending, (state) => {
                state.analysis.loading = true;
                state.analysis.error = null;
            })
            .addCase(fetchPersonalAnalysis.fulfilled, (state, action) => {
                state.analysis.loading = false;
                state.analysis.data = action.payload;
            })
            .addCase(fetchPersonalAnalysis.rejected, (state, action) => {
                state.analysis.loading = false;
                state.analysis.error = action.payload;
            });
    },
});

export const {
    setInputMode,
    updateField,
    toggleParticipant,
    setRawText,
    setVoiceTranscript,
    setVoiceRecording,
    setVoiceSupported,
    resetForm,
    clearParseError,
    clearScanError,
    resetSubmitStatus,
    clearAnalysis,
    clearErrors,
} = aiSlice.actions;

export default aiSlice.reducer;

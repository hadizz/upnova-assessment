import { useCallback, useRef, useState } from 'react';

const CORRECT_CODE = '123456';

export interface UseOTPInputOptions {
    numDigits?: number;
    onSuccess?: () => void;
    onError?: () => void;
}

export type OTPStatus = 'idle' | 'error' | 'success';

export function useOTPInput({
    numDigits = 6,
    onSuccess,
    onError,
}: UseOTPInputOptions = {}) {
    const [digits, setDigits] = useState<string[]>(Array(numDigits).fill(''));
    const [status, setStatus] = useState<OTPStatus>('idle');
    const [isShaking, setIsShaking] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const reset = useCallback(() => {
        setDigits(Array(numDigits).fill(''));
        setHighlightIndex(0);
        setStatus('idle');
        setIsShaking(false);
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);
    }, [numDigits]);

    const verifyCode = useCallback(async (code: string): Promise<boolean> => {
        if (code === CORRECT_CODE) {
            setStatus('success');
            onSuccess?.();
            return true;
        } else {
            setStatus('error');
            setIsShaking(true);
            onError?.();

            // Animate highlight back to start
            for (let i = numDigits - 1; i >= 0; i--) {
                setHighlightIndex(i);
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            // Clear after animation
            setTimeout(() => {
                setDigits(Array(numDigits).fill(''));
                setHighlightIndex(0);
                setStatus('idle');
                setIsShaking(false);
                inputRefs.current[0]?.focus();
            }, 100);

            return false;
        }
    }, [numDigits, onSuccess, onError]);

    const handleChange = useCallback((index: number, value: string) => {
        if (status === 'success') return;

        const digit = value.replace(/\D/g, '').slice(-1);
        const newDigits = [...digits];
        newDigits[index] = digit;
        setDigits(newDigits);

        if (digit && index < numDigits - 1) {
            const nextIndex = index + 1;
            setHighlightIndex(nextIndex);
            inputRefs.current[nextIndex]?.focus();
        } else if (digit && index === numDigits - 1) {
            verifyCode(newDigits.join(''));
        }
    }, [status, digits, numDigits, verifyCode]);

    const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (status === 'success') return;

        // Handle digit input - allows overwriting existing value
        if (/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            const newDigits = [...digits];
            newDigits[index] = e.key;
            setDigits(newDigits);

            if (index < numDigits - 1) {
                const nextIndex = index + 1;
                setHighlightIndex(nextIndex);
                inputRefs.current[nextIndex]?.focus();
            } else {
                verifyCode(newDigits.join(''));
            }
            return;
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            const newDigits = [...digits];

            if (digits[index]) {
                newDigits[index] = '';
                setDigits(newDigits);
            } else if (index > 0) {
                newDigits[index - 1] = '';
                setDigits(newDigits);
                const prevIndex = index - 1;
                setHighlightIndex(prevIndex);
                inputRefs.current[prevIndex]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            const prevIndex = index - 1;
            setHighlightIndex(prevIndex);
            inputRefs.current[prevIndex]?.focus();
        } else if (e.key === 'ArrowRight' && index < numDigits - 1) {
            const nextIndex = index + 1;
            setHighlightIndex(nextIndex);
            inputRefs.current[nextIndex]?.focus();
        }
    }, [status, digits, numDigits, verifyCode]);

    const handleFocus = useCallback((index: number) => {
        if (status === 'success') return;
        setHighlightIndex(index);
    }, [status]);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        if (status === 'success') return;

        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, numDigits);

        if (pastedData) {
            const newDigits = [...digits];
            for (let i = 0; i < pastedData.length; i++) {
                newDigits[i] = pastedData[i];
            }
            setDigits(newDigits);

            const lastFilledIndex = Math.min(pastedData.length - 1, numDigits - 1);
            setHighlightIndex(lastFilledIndex);

            if (pastedData.length === numDigits) {
                verifyCode(pastedData);
            } else {
                inputRefs.current[Math.min(pastedData.length, numDigits - 1)]?.focus();
            }
        }
    }, [status, digits, numDigits, verifyCode]);

    const setInputRef = useCallback((index: number, el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
    }, []);

    return {
        digits,
        status,
        isShaking,
        highlightIndex,
        inputRefs,
        reset,
        setInputRef,
        handlers: {
            handleChange,
            handleKeyDown,
            handleFocus,
            handlePaste,
        },
    };
}


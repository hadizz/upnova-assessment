import { Lock, Mail, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import InputBox from './InputBox';
import { useOTPInput } from './useOTPInput';

const NUM_DIGITS = 6;

interface OTPInputProps {
    onSuccess?: () => void;
}

// Exit animation config for sliding up and fading out
const exitAnimation = {
    initial: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' as const },
};

export function OTPInput({ onSuccess }: OTPInputProps) {
    const [showLock, setShowLock] = useState(false);
    const [iconScope, animateIcon] = useAnimate();

    const {
        digits,
        status,
        isShaking,
        highlightIndex,
        inputRefs,
        reset,
        setInputRef,
        handlers,
    } = useOTPInput({
        numDigits: NUM_DIGITS,
        onSuccess: async () => {
            // Squash and stretch animation
            await animateIcon(
                iconScope.current,
                { scaleY: 0.8, scaleX: 1.05, y: 8 },
                { duration: 0.1, ease: 'easeIn' }
            );

            setShowLock(true);

            await animateIcon(
                iconScope.current,
                { scaleY: 1.05, scaleX: 0.9, y: -4 },
                { duration: 0.15, ease: 'easeOut' }
            );

            await animateIcon(
                iconScope.current,
                { scaleY: 1, scaleX: 1, y: 0 },
                { duration: 0.2, ease: 'easeOut' }
            );

            onSuccess?.();
        },
    });

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, [inputRefs]);

    const handleReset = () => {
        setShowLock(false);
        reset();
    };

    const isSuccess = status === 'success';

    return (
        <div className="flex flex-col items-center gap-8">
            {/* Icon Circle */}
            <div
                ref={iconScope}
                className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50"
            >
                {showLock ? (
                    <Lock className="w-10 h-10 text-blue-400" strokeWidth={2} />
                ) : (
                    <Mail className="w-10 h-10 text-blue-400" strokeWidth={2} />
                )}
            </div>

            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        key="otp-form"
                        className="flex flex-col items-center gap-8"
                        {...exitAnimation}
                    >
                        {/* Title */}
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Enter Verification Code
                            </h2>
                            <p className="text-muted-foreground">
                                We sent a 6-digit code to your email
                            </p>
                        </div>

                        {/* OTP Input Boxes */}
                        <div className="relative">
                            <motion.div
                                animate={isShaking ? {
                                    x: [0, -10, 10, -10, 10, -5, 5, 0]
                                } : {}}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex gap-3">
                                    {[0, 1, 2].map((index) => (
                                        <InputBox
                                            key={index}
                                            index={index}
                                            digit={digits[index]}
                                            isHighlighted={highlightIndex === index && !isSuccess}
                                            isError={status === 'error'}
                                            disabled={isSuccess}
                                            setInputRef={setInputRef}
                                            handlers={handlers}
                                        />
                                    ))}
                                </div>

                                <div className="w-4 h-1 bg-border rounded-full mx-1" />

                                <div className="flex gap-3">
                                    {[3, 4, 5].map((index) => (
                                        <InputBox
                                            key={index}
                                            index={index}
                                            digit={digits[index]}
                                            isHighlighted={highlightIndex === index && !isSuccess}
                                            isError={status === 'error'}
                                            disabled={isSuccess}
                                            setInputRef={setInputRef}
                                            handlers={handlers}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Error message */}
                            <AnimatePresence>
                                {status === 'error' && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute left-0 right-0 text-center mt-2 text-destructive text-sm font-medium"
                                    >
                                        Incorrect code. Please try again.
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success-state"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Welcome!
                            </h2>
                            <p className="text-muted-foreground">
                                Verification successful
                            </p>
                        </div>

                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-accent rounded-lg transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

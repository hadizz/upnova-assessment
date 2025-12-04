import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

// Extracted InputBox component for cleaner code
interface InputBoxProps {
    index: number;
    digit: string;
    isHighlighted: boolean;
    isError: boolean;
    disabled: boolean;
    setInputRef: (index: number, el: HTMLInputElement | null) => void;
    handlers: {
        handleChange: (index: number, value: string) => void;
        handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
        handleFocus: (index: number) => void;
        handlePaste: (e: React.ClipboardEvent) => void;
    };
}

function InputBox({ index, digit, isHighlighted, isError, disabled, setInputRef, handlers }: InputBoxProps) {
    return (
        <div className="relative">
            <input
                ref={(el) => setInputRef(index, el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlers.handleChange(index, e.target.value)}
                onKeyDown={(e) => handlers.handleKeyDown(index, e)}
                onFocus={() => handlers.handleFocus(index)}
                onPaste={handlers.handlePaste}
                disabled={disabled}
                className="w-14 h-16 text-center text-2xl font-semibold bg-card border-2 border-border rounded-xl focus:outline-none transition-colors duration-200 disabled:bg-muted disabled:cursor-not-allowed text-transparent"
                style={{ caretColor: 'transparent' }}
            />

            {/* Animated digit display */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                    {digit ? (
                        <motion.span
                            key={`digit-${index}-${digit}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 30,
                                duration: 0.2
                            }}
                            className="text-2xl font-semibold text-foreground"
                        >
                            {digit}
                        </motion.span>
                    ) : (
                        <span className="text-2xl font-semibold text-muted-foreground/50">
                            0
                        </span>
                    )}
                </AnimatePresence>
            </div>

            {/* Moving highlight border */}
            {isHighlighted && (
                <motion.div
                    layoutId="otp-highlight"
                    className={cn(
                        "absolute inset-0 rounded-xl pointer-events-none border-2",
                        isError ? "border-red-500" : "border-blue-500"
                    )}
                    transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                    }}
                />
            )}
        </div>
    );
}


export default InputBox;
import { OTPInput } from '../components/task2/OTPInput';

export function Task2Page() {

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
            <div
                className="bg-card rounded-3xl border border-border shadow-sm p-8"
            >
                <OTPInput />
            </div>
        </div>
    );
}

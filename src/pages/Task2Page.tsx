import { OTPInput } from '../components/task2/OTPInput';

export function Task2Page() {

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/20 p-8"
            >
                <OTPInput />
            </div>
        </div>
    );
}

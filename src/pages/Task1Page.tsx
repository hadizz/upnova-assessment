import { Button } from "@/components/ui/button";
import CartChainManager from "@/core/CartChainManager";
import { useState } from "react";

export function Task1Page() {
    const [cart, setCart] = useState<any>({ id: '123', items: [{ id: '123', quantity: 1, title: 'Product' }] });
    const [history, setHistory] = useState<any[]>([]);
    const [chainStopped, setChainStopped] = useState<string | null>(null);

    const onClick = async () => {
        const fakeFetch = async (url: string) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Fake fetch completed for URL:', url);
        }

        const cartEventManager = new CartChainManager();

        cartEventManager.addChainEvent({
            name: 'CHECK_AND_ADD_GIFT',
            action: async (cart) => {
                // Only add gift if cart total > $100 (simulated check)
                const shouldAddGift = cart.items.length > 0; // Simple condition for demo

                if (!shouldAddGift) {
                    console.log('Condition not met, stopping chain');
                    return null; // ⛔ This stops the chain!
                }

                await fakeFetch('check the cart, call /cart/add to add the gift');
                return { ...cart, items: [...cart.items, { id: 'gift-001', quantity: 1, title: 'Free Gift 🎁' }] };
            }
        })

        cartEventManager.addChainEvent({
            name: 'CHECK_CART_VALUE',
            action: async (cart) => {
                // Example: Stop chain if cart has too many items
                if (cart.items.length > 5) {
                    console.log('Too many items, stopping chain');
                    return null; // ⛔ This stops the chain!
                }
                await fakeFetch('checking cart value...');
                return cart;
            }
        })

        cartEventManager.addChainEvent({
            name: 'UPDATE_CART_ATTRIBUTE',
            action: async (cart) => {
                await fakeFetch('call /cart/update.js to update cart attribute');
                return { ...cart, attribute: 'gift_added' };
            }
        })
        // const cart = await fetch('/cart.json').then(res => res.json())
        setChainStopped(null);
        await cartEventManager.startChainEvent(cart);

        // Check if chain was stopped early (not all events ran)
        const totalEvents = 3; // We added 3 events
        const ranEvents = cartEventManager.getHistory().length;
        if (ranEvents < totalEvents) {
            setChainStopped(`Chain stopped after "${cartEventManager.getHistory()[ranEvents - 1]?.name}"`);
        }

        console.log('CHAIN FINISHED');
        setCart(cartEventManager.getCart());
        setHistory(cartEventManager.getHistory());
    }

    // Test with empty cart - chain will STOP at first event
    const onClickStopDemo = async () => {
        const fakeFetch = async (url: string) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Fake fetch completed for URL:', url);
        }

        const cartEventManager = new CartChainManager();

        cartEventManager.addChainEvent({
            name: 'CHECK_AND_ADD_GIFT',
            action: async (cart) => {
                if (cart.items.length === 0) {
                    console.log('❌ Empty cart - stopping chain!');
                    return null; // ⛔ STOPS HERE!
                }
                await fakeFetch('adding gift...');
                return { ...cart, items: [...cart.items, { id: 'gift', title: 'Gift' }] };
            }
        });

        cartEventManager.addChainEvent({
            name: 'UPDATE_ATTRIBUTE',
            action: async (cart) => {
                await fakeFetch('updating attribute...');
                return { ...cart, attribute: 'updated' };
            }
        });

        setChainStopped(null);
        await cartEventManager.startChainEvent({ id: 'empty-cart', items: [] }); // Empty cart!

        const ranEvents = cartEventManager.getHistory().length;
        if (ranEvents < 2) {
            setChainStopped(`Chain stopped at "${cartEventManager.getHistory()[ranEvents - 1]?.name}" - remaining events skipped!`);
        }

        setCart(cartEventManager.getCart());
        setHistory(cartEventManager.getHistory());
    }

    const onReset = () => {
        setCart({ id: '123', items: [{ id: '123', quantity: 1, title: 'Product' }] });
        setHistory([]);
        setChainStopped(null);
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">Task 1</h1>
                <div className="flex gap-3 justify-center">
                    <Button onClick={onClick}>Run Chain (Normal)</Button>
                    <Button onClick={onClickStopDemo} variant="destructive">Run Chain (Stop Demo)</Button>
                    <Button onClick={onReset} variant="outline">Reset</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                    "Normal" runs the full chain. "Stop Demo" uses an empty cart to demonstrate chain stopping.
                </p>
                {chainStopped && (
                    <div className="mt-3 p-3 bg-destructive/10 border border-destructive rounded-lg">
                        <p className="text-sm text-destructive font-medium">⛔ {chainStopped}</p>
                    </div>
                )}
                <div className="mt-8 flex flex-row gap-4 min-w-6xl">
                    <div className="flex-1 bg-card border border-border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Current Cart</h3>
                        <pre className="text-sm bg-muted p-3 rounded overflow-auto text-left">
                            {JSON.stringify(cart, null, 2)}
                        </pre>
                    </div>
                    <div className="flex-1 bg-card border border-border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">History Stack</h3>
                        <div className="space-y-2">
                            {history.map((item) => (
                                <div key={item.name}>
                                    <p className="text-sm text-muted-foreground">
                                        {item.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

class CartChainManager {
    private cart: any;
    private events: { name: string; action: (cart: any) => Promise<any> }[] = [];
    private history: { name: string; action: (cart: any) => Promise<any> }[] = [];

    addChainEvent(event: { name: string; action: (cart: any) => Promise<any> }) {
        this.events.push(event);
    }

    async startChainEvent(cart: any): Promise<any> {
        this.cart = cart;

        while (this.events.length > 0) {
            const event = this.events.shift()!; 
            
            try {
                console.log(`[CartChain] Running: ${event.name}`);
                const newCart = await event.action(this.cart);

                if (newCart == null) {
                    console.log(`[CartChain] Stopped at: ${event.name} (returned null/undefined)`);
                    break;
                } 
                
                this.cart = newCart;
            } catch (error) {
                console.error(`[CartChain] Error in ${event.name}:`, error);
                throw error;
            } finally {
                this.history.push(event);
            }
        }

        console.log(`[CartChain] Chain finished, final cart:`, this.cart);
        return this.cart;
    }

    getCart() {
        return this.cart;
    }

    getHistory() {
        return this.history;
    }
}

export default CartChainManager;
import { useState, useCallback } from 'react';
import { Product, Contract, ProductEvent } from './types';
import { mockProduct } from './services/mockData';
import {
  getEvents,
  simulateNextEvent,
  hasMoreEvents,
  resetEvents,
} from './services/eventService';
import { getContract, syncContractStatus, resetContract } from './services/contractService';
import { ProductCard } from './components/ProductCard';
import { EventTimeline } from './components/EventTimeline';
import { SimulateButton } from './components/SimulateButton';

function App() {
  const [product, setProduct] = useState<Product>(mockProduct);
  const [contract, setContract] = useState<Contract>(getContract());
  const [events, setEvents] = useState<ProductEvent[]>(getEvents());
  const [loading, setLoading] = useState(false);
  const [journeyComplete, setJourneyComplete] = useState(false);

  const handleSimulate = useCallback(() => {
    setLoading(true);

    // Simulate async operation (e.g., blockchain tx)
    setTimeout(() => {
      const newEvent = simulateNextEvent();

      if (newEvent) {
        const updatedEvents = getEvents();
        const newContractStatus = syncContractStatus(newEvent.status);
        const updatedContract = { ...getContract(), status: newContractStatus };

        setEvents(updatedEvents);
        setContract(updatedContract);
        setProduct((prev) => ({ ...prev, currentStatus: newEvent.status }));

        if (!hasMoreEvents()) {
          setJourneyComplete(true);
        }
      }

      setLoading(false);
    }, 800);
  }, []);

  const handleReset = useCallback(() => {
    resetEvents();
    resetContract();
    setProduct(mockProduct);
    setContract(getContract());
    setEvents(getEvents());
    setJourneyComplete(false);
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__logo">
          ☀ Solar<span>is</span>
        </h1>
        <p className="app__tagline">Supply-chain transparency · Smart contract demo</p>
      </header>

      <main className="app__main">
        <section className="app__section" aria-label="Product details">
          <h2 className="app__section-title">Product</h2>
          <ProductCard product={product} contract={contract} />
        </section>

        <section className="app__section" aria-label="Event timeline">
          <h2 className="app__section-title">Event Timeline</h2>
          <EventTimeline events={events} />
        </section>
      </main>

      <div className="app__actions">
        {journeyComplete ? (
          <>
            <p className="app__status-msg app__status-msg--done">
              ✅ Journey complete — contract fulfilled!
            </p>
            <SimulateButton
              onClick={handleReset}
              label="Reset Demo"
              disabled={loading}
            />
          </>
        ) : (
          <>
            <SimulateButton
              onClick={handleSimulate}
              disabled={loading}
              loading={loading}
            />
            <p className="app__status-msg">
              Click to advance the product through its supply-chain journey.
            </p>
          </>
        )}
      </div>

      <footer className="app__footer">
        <p>Solaris Demo · Proof of function · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;

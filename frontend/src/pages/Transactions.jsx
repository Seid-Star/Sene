import { useCallback, useEffect, useState } from "react";
import { getMyTransactions } from "../services/transactionService";
import {
  formatDate,
  formatPrice,
  formatQuantity,
  getPaymentStatusLabel,
  getTransactionStatusLabel,
} from "../utils/formatters";
import { DEFAULT_LANGUAGE, getPageLabels } from "./pageLabels";
import "./pages.css";

const idOf = (person) => person?._id ?? person?.id;

// Props:
//   fetchTransactions - async () => array. Defaults to the service.
//   currentUserId     - id of the logged-in user, used to show the user's role
//   lang              - 'am' | 'om' | 'en' (default 'am')
// This page only DISPLAYS transactions. It never marks anything as paid or
// completed. Payment confirmation is controlled by the backend.
function Transactions({
  fetchTransactions = getMyTransactions,
  currentUserId,
  lang = DEFAULT_LANGUAGE,
}) {
  const t = getPageLabels(lang).transactions;
  const [state, setState] = useState({
    status: "loading",
    items: [],
    error: "",
  });

  const load = useCallback(async () => {
    try {
      const items = await fetchTransactions();
      return {
        status: "ready",
        items: Array.isArray(items) ? items : [],
        error: "",
      };
    } catch (error) {
      return { status: "error", items: [], error: error?.message || "" };
    }
  }, [fetchTransactions]);

  useEffect(() => {
    let cancelled = false;
    load().then((result) => {
      if (!cancelled) setState(result);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const retry = () => {
    setState((previous) => ({ ...previous, status: "loading" }));
    load().then(setState);
  };

  const roleOf = (transaction) => {
    if (currentUserId == null) return null;
    const me = String(currentUserId);
    if (String(idOf(transaction.buyer)) === me) return t.youAreBuyer;
    if (String(idOf(transaction.seller)) === me) return t.youAreSeller;
    return null;
  };

  let content;
  if (state.status === "loading") {
    content = (
      <p className="page__message" role="status">
        {t.loading}
      </p>
    );
  } else if (state.status === "error") {
    content = (
      <div className="page__message page__message--error" role="alert">
        <p>
          {t.errorText} {state.error}
        </p>
        <button type="button" className="page__button" onClick={retry}>
          {t.retry}
        </button>
      </div>
    );
  } else if (state.items.length === 0) {
    content = (
      <p className="page__message" role="status">
        {t.empty}
      </p>
    );
  } else {
    content = (
      <div className="page__grid">
        {state.items.map((tx) => {
          const role = roleOf(tx);
          return (
            <article className="tx-card" key={tx._id}>
              <div className="tx-card__header">
                <h2 className="tx-card__title">
                  {tx.listing?.cropName || "—"}
                </h2>
                {role && <span className="tx-card__role">{role}</span>}
              </div>
              <dl className="tx-card__facts">
                <div>
                  <dt>{t.buyer}</dt>
                  <dd>{tx.buyer?.name || "—"}</dd>
                </div>
                <div>
                  <dt>{t.seller}</dt>
                  <dd>{tx.seller?.name || "—"}</dd>
                </div>
                <div>
                  <dt>{t.quantity}</dt>
                  <dd>{formatQuantity(tx.quantity, tx.unit)}</dd>
                </div>
                <div>
                  <dt>{t.price}</dt>
                  <dd>{formatPrice(tx.pricePerUnit)}</dd>
                </div>
                {/* The total comes from the backend. We never calculate it. */}
                <div>
                  <dt>{t.total}</dt>
                  <dd>{formatPrice(tx.totalAmount)}</dd>
                </div>
                <div>
                  <dt>{t.transactionStatus}</dt>
                  <dd>{getTransactionStatusLabel(tx.status)}</dd>
                </div>
                <div>
                  <dt>{t.paymentStatus}</dt>
                  <dd>{getPaymentStatusLabel(tx.paymentStatus)}</dd>
                </div>
                <div>
                  <dt>{t.date}</dt>
                  <dd>{formatDate(tx.createdAt)}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <main className="page" lang={lang}>
      <h1 className="page__title">{t.title}</h1>
      {content}
    </main>
  );
}

export default Transactions;

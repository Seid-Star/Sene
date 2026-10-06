import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-green-50 via-white to-amber-50">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-sm font-medium text-green-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Connecting farmers to better markets
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Give your harvest a{" "}
              <span className="text-green-600">better voice.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              SENE connects farmers and buyers through a simple marketplace
              powered by voice. Find produce, discover fair prices, and trade
              with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
              >
                Explore marketplace
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Start selling
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-500">
              <div>
                <span className="font-semibold text-gray-900">Voice-first</span>
                <p>Simple interaction</p>
              </div>

              <div>
                <span className="font-semibold text-gray-900">
                  Local marketplace
                </span>
                <p>Built for farmers</p>
              </div>

              <div>
                <span className="font-semibold text-gray-900">Fair trade</span>
                <p>Better price visibility</p>
              </div>
            </div>
          </div>

          {/* Voice card */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2rem] bg-green-200/30 blur-3xl" />

            <div className="relative rounded-3xl border border-white bg-white p-6 shadow-2xl shadow-gray-900/10">
              <div className="rounded-2xl bg-gray-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">SENE Voice</p>
                    <p className="mt-1 font-semibold">How can I help?</p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/20">
                    <span className="text-xl">🎙️</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-600 shadow-lg shadow-green-500/30">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl">
                      🎙️
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-400">
                  Ask about prices, listings, or your marketplace activity.
                </p>
              </div>

              <div className="mt-4 rounded-2xl bg-green-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                  Example
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  “What is the current price of teff?”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Built for the harvest
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              A simpler way to trade agricultural produce.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Feature
              icon="🎙️"
              title="Voice powered"
              description="Interact naturally with SENE and access marketplace actions through voice."
            />

            <Feature
              icon="🌾"
              title="Sell your produce"
              description="Create listings and make your harvest visible to potential buyers."
            />

            <Feature
              icon="📈"
              title="Know the price"
              description="Check available market price information before making decisions."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>

      <p className="mt-2 leading-7 text-gray-600">{description}</p>
    </div>
  );
}

export default Home;
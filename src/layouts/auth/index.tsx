// @ts-nocheck
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "routes";

export default function Auth() {
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  document.documentElement.dir = "ltr";
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex">
            <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%]  lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
              <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
                <Routes>
                  {getRoutes(routes)}
                  <Route
                    path="/"
                    element={<Navigate to="/auth/sign-in" replace />}
                  />
                </Routes>
                <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">

                  <div className="absolute inset-0 bg-navy-800 lg:rounded-bl-[120px] xl:rounded-bl-[200px]"
                    style={{ background: "linear-gradient(160deg, #162145 0%, #0a1226 100%)" }}
                  />

                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at center top, #D3AB5C18 0%, transparent 70%)" }}
                  />

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-gold-500/10 pointer-events-none" />

                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-10 gap-6">
                    <img
                      src="/brand/IKA Logo-02.png"
                      alt="IKA"
                      className="w-[160px] h-[160px] object-contain drop-shadow-xl"
                    />
                    <div>
                      <h1 className="text-2xl xl:text-3xl font-black text-white leading-snug">
                        International <br />
                        <span style={{
                          background: "linear-gradient(90deg, #e6c676, #D3AB5C, #b8934a)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}>
                          Knowledge Academy
                        </span>
                      </h1>
                      <p className="mt-3 text-sm text-navy-300 max-w-xs mx-auto leading-relaxed">
                        Empowering minds through world-class education and professional development.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-8 h-px bg-gold-500/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60" />
                      <span className="w-8 h-px bg-gold-500/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

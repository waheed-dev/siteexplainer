import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState<String>("");
  const [latestSites, setLatestSites] = useState<Array<any>>([]);
  // console.log("Streamed response: ", generatedSummary);
  useEffect(() => {
    console.log('loaded')
    fetch("/api/latestSites")
      .then((res) => res.json())
      .then((data) => {
        let newLatestSites: String[] = []
        data.map((url: any) => newLatestSites.push(url.url));
        setLatestSites(newLatestSites);

        console.log(data);
      });
  }, []);

  const generateSummary = async (e: any) => {
    e.preventDefault();
    setGeneratedSummary("");
    setLoading(true);

    const isValidURL = (str: string) => {
      try {
        new URL(str);
        return true;
      } catch (error) {
        return false;
      }
    };

    let fullUrl = url.trim();
    if (!/^https?:\/\//i.test(fullUrl)) {
      fullUrl = "https://" + fullUrl;
    }
    console.log(fullUrl)

    if (!isValidURL(fullUrl)) {
      console.error("Invalid URL provided.");
      // display a toast
      toast.error("Invalid URL provided", {
        icon: '❌'
      })
      setLoading(false);
      return;
    }

    console.log("url is", fullUrl)
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: fullUrl
      }),
    });
    console.log("Edge function returned.");
    console.log("Response is", response)

    if (!response.ok) {
      const statusText = response.statusText ? response.statusText : "This site isn't valid. Maybe try another?"
      toast.error(response.statusText, {
        icon: '❌'
      })
      setLoading(false)
      // throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      setLoading(false);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedSummary((prev) => {
        console.log("summary is ", prev + chunkValue);

        if (done && generateSummary.length >= 50) {
          fetch("/api/postSummary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: fullUrl,
              summary: generatedSummary
            }),
          });
        }
          return prev + chunkValue;
        });
    }

    setLoading(false);



  };
 function handleLatestSiteClick(url: string) {
    setUrl(url);
    generateSummaryURL(url);
  }

  const generateSummaryURL = async (recentURL: string) => {
    setGeneratedSummary("");
    setLoading(true);

    const isValidURL = (str: string) => {
      try {
        new URL(str);
        return true;
      } catch (error) {
        return false;
      }
    };

    let fullUrl = recentURL.trim();
    if (!/^https?:\/\//i.test(fullUrl)) {
      fullUrl = "https://" + fullUrl;
    }
    console.log(fullUrl)

    if (!isValidURL(fullUrl)) {
      console.error("Invalid URL provided.");
      // display a toast
      toast.error("Invalid URL provided", {
        icon: '❌'
      })
      setLoading(false);
      return;
    }

    console.log("url is", fullUrl)
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: fullUrl
      }),
    });
    console.log("Edge function returned.");
    console.log("Response is", response)

    if (!response.ok) {
      toast.error(response.statusText, {
        icon: '❌'
      })
      setLoading(false)
      // throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      setLoading(false);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedSummary((prev) => {
        console.log("summary is ", prev + chunkValue);

        if (done && generateSummary.length >= 50) {
          fetch("/api/postSummary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: fullUrl,
              summary: generatedSummary
            }),
          });
        }
          return prev + chunkValue;
        });
    }

    setLoading(false);



  };

  

  return (
    <><div><Toaster /></div>
      <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
        <Head>
          <title>Twitter Generator</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />
        <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
            href="https://github.com/Nutlope/twitterbio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>Star on GitHub</p>
          </a>
          <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
            What does this site do?
          </h1>
          <h2 className="text-xl text-gray-800 max-w-3xl mt-7">
            This site uses machine learning to generate a summary of any website.
          </h2>
          <p className="text-slate-500 mt-5">5196 site summaries generated so far.</p>
          <div className="max-w-xl w-full">
            <div className="flex mt-10 items-center space-x-3">
              <Image
                src="/1-black.png"
                width={30}
                height={30}
                alt="1 icon"
                className="mb-5 sm:mb-0"
              />
              <p className="text-left font-medium">
                your website url{" "}
                <span className="text-slate-500">
                  (or write a few sentences about yourself)
                </span>
                .
              </p>
            </div>
            <textarea
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
              placeholder={
                "e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com."
              }
            />

            {!loading && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                onClick={(e) => generateSummary(e)}
              >
                Generate your bio &rarr;
              </button>
            )}
            {loading && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                disabled
              >
                <LoadingDots color="white" style="large" />
              </button>
            )}
          </div>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
          <ResizablePanel>
            <AnimatePresence mode="wait">
              <motion.div className="space-y-10 my-10">
                {generatedSummary && (
                  <>
                    <div>
                      <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                        Your generated bios
                      </h2>
                    </div>
                    <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedSummary.toString());
                          toast("Bio copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                      >
                        <p>{generatedSummary}</p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            {latestSites && latestSites.length !== 0 && (
              <div className="px-2 py-2 bg-gray-200 rounded-lg my-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                  <div className="bg-white px-4 py-4 rounded-lg shadow-xl sm:max-w-md sm:mx-auto sm:px-6">
                    <h2 className="text-3xl text-gray-900 font-medium mb-2">
                      Latest Searches
                    </h2>
                    <ul>
                    {latestSites.map((url, index) => (
                      <AnimatePresence key={`latest-site-${index}`}>
                        <motion.li
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-gray-600"
                          key={`latest-site-${index}`}
                        >
                          <button
                            onClick={() => handleLatestSiteClick(url)}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg"
                          >
                            {url}
                          </button>
                        </motion.li>
                      </AnimatePresence>
                    ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </ResizablePanel>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;

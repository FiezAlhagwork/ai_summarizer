/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({ url: "", summary: "", lang: "en" });
  const [allArticle, setAllArticle] = useState([]);
  const [copied, setCopied] = useState("")
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({
      articleUrl: article.url,
      lang: article.lang,
    });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updataArticle = [newArticle, ...allArticle];

      setArticle(newArticle);
      setAllArticle(updataArticle);
      localStorage.setItem("articles", JSON.stringify(updataArticle));
    }
  };

  useEffect(() => {
    const articlesFormLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );
    if (articlesFormLocalStorage) {
      setAllArticle(articlesFormLocalStorage);
    }
  }, []);



  const handleCopy = (copyUrl) => {
      setCopied(copyUrl);
      navigator.clipboard.writeText(copyUrl)
      setTimeout(() => {
        setCopied(false)
      }, 3000);
  }
  return (
    <section className="mt-16 w-full max-w-xl">
      {/* search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className=" relative flex justify-center items-center flex-col"
          onSubmit={handleSubmit}
        >
          <select
            className="url_input my-3"
            value={article.lang}
            onChange={(e) => setArticle({ ...article, lang: e.target.value })}
            required
            name=""
            id=""
            placeholder="Enter a lang"
          >
            <option value="en">Englash</option>
            <option value="ar">Arabic</option>
          </select>

          <img
            src={linkIcon}
            alt="Link_Icon"
            className=" absolute left-0 top-[65%] my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 items-center"
          >
            {"<="}
          </button>
        </form>

        {/*  Browser URL History */}
        <div className=" flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticle.map((item, index) => {
            return (
              <div
                onClick={() => {
                  setArticle(item);
                }}
                key={`link-${index}`}
                className="link_card"
              >
                <div className="copy_btn" onClick={() => {handleCopy(item.url)}}>
                  <img
                    src={copied === item.url ? tick : copy}
                    alt=""
                    className="w-[40%] h-[40%] object-contain"
                  />
                </div>
                <p className="flex-1 font-satoshi font-medium text-blue-700 text-sm truncate ">
                  {item.url}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Display Results */}

      <div className=" max-w-full my-10 flex justify-center items-center ">
        {isFetching ? (
          <img src={loader} alt="" className="w-20 h-20" />
        ) : error ? (
          <p className=" font-inter font-bold text-black text-center">
            will ,that wasn`t supposed to happen <br />
            <span className=" font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className=" font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary </span>
              </h2>
              <div className={`summary_box `}>
                <p className=" font-inter font-medium text-sm text-gray-700">{article.summary}</p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;

{
  /* <div >
{isFetching ?  : error ?  : (<div>jgfjfj<div/>) }
</div> */
}

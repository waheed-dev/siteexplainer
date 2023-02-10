import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3">
      <div className="flex flex-row justify-center w-full">
        <div className="flex flex-row">
          <p className="font-bold hover:underline transition underline-offset-2 ml-1"></p>
          <p className="font-bold transition">
            Follow @michael_chomsky on{" "}
            <Link href="" className="text-blue-600 hover:underline">
              Twitter
            </Link>
          </p>
        </div>
      </div>
      <div className="font-semibold">
        Donate to support the Project
        <Link
          href="https://www.paypal.com/donate/?business=9CKXQHCEVY3V6&no_recurring=0&item_name=This+donation+will+help+me+keep+siteexplainer.com+up+and+running%21+API+fees+cost+me+around+1k+per+week%21&currency_code=USD"
          className="text-blue-600 font-bold hover:underline">
          {" "}
          Paypal
        </Link>
      </div>
      <p className="font-semibold">@Copyright all rights reserved</p>
    </footer>
  );
}

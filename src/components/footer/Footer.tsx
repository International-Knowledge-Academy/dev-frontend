// @ts-nocheck
const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
      <h5 className="mb-4 text-center text-sm font-medium text-slate-600 sm:!mb-0 md:text-lg">
        <p className="mb-4 text-center text-sm text-slate-600 sm:!mb-0 md:text-base">
          © {new Date().getFullYear()} International Knowledge Academy. All rights reserved.
        </p>
      </h5>
      <div>
      </div>
    </div>
  );
};

export default Footer;

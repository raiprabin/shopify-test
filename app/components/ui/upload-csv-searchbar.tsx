import {useRef, useState} from 'react';
import {useOutsideClick} from '~/hooks/useOutsideClick';
import {PredictiveSearch, SearchVariant} from './predictive-search';
import {BulkCsvUpload} from './bulk-csv-upload';

export function ProductSearchBar({
  searchVariant,
}: {
  searchVariant: SearchVariant;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleInputClick() {
    setShowSuggestions(true);
  }
  const productRef = useRef<HTMLDivElement>(null);
  useOutsideClick(productRef, () => setShowSuggestions(false));

  return (
    // <div
    //   className="search-bar flex bg-white items-center min-w-[unset] w-full px-4 py-3 xl:min-w-[453px] max-h-14 relative"
    //   ref={productRef}
    // >
    //   <FaSearch className="w-5 h-5 search-icon fill-primary-500" />
    //   <input
    //     type="text"
    //     placeholder="Rapid Product Search.."
    //     className="border-none w-full placeholder-italic text-base font-bold text-grey-700 placeholder-text-[#0F1010] focus:bg-white "
    //     onClick={handleInputClick}
    //   />
    //   {showSuggestions && <RecomendedProduct />}
    // </div>
    <div
      className="search-bar flex bg-white items-center min-w-[unset] w-full px-4 py-3 xl:min-w-[453px] max-h-14 relative"
      ref={productRef}
    >
      <PredictiveSearch
        inputPlaceholder="Rapid Product Search..."
        searchVariant={searchVariant}
      />
    </div>
  );
}

export default function UploadSearchbar({
  searchVariant,
  action,
}: {
  searchVariant: SearchVariant;
  action: string;
}) {
  return (
    <div className=" bg-primary-500">
      <div className="container flex flex-col items-center gap-6 py-6 sm:flex-row">
        <ProductSearchBar searchVariant={searchVariant} />
        <BulkCsvUpload btnSecondary={true} action={action} />
      </div>
    </div>
  );
}

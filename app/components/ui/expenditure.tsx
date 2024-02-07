const Expenditure = () => {
    return (
        <div className="flex flex-col mxs:flex-row gap-x-8 gap-y-6 expenditure">
            <div className='relative after:content-[""] after:absolute after:bg-grey-50 after:-bottom-3 after:w-full after:h-px after:mxs:w-px after:mxs:h-14 after:mxs:top-0 after:mxs:-right-4'>
                <p className='font-medium capitalize'>YTD</p>
                <p className='text-lg italic font-bold lg:text-xl xl:text-2xl'>$ <span className='text-xl lg:text-2xl xl:text-3xl'>780.4</span> K</p>
            </div>
            <div className='relative after:content-[""] after:absolute after:bg-grey-50 after:-bottom-3 after:w-full after:h-px after:mxs:w-px after:mxs:h-14 after:mxs:top-0 after:mxs:-right-4'>
                <p className='font-medium capitalize'>YTD last year</p>
                <p className='text-lg italic font-bold lg:text-xl xl:text-2xl'>$ <span className='text-xl lg:text-2xl xl:text-3xl'>886</span> K</p>
            </div>
            <div className='relative after:content-[""] after:absolute after:bg-grey-50 after:-bottom-3 after:w-full after:h-px after:mxs:w-px after:mxs:h-14 after:mxs:top-0 after:mxs:-right-4'>
                <p className='font-medium capitalize'>full spend previous year</p>
                <p className='text-lg italic font-bold lg:text-xl xl:text-2xl'>$ <span className='text-xl lg:text-2xl xl:text-3xl'>900</span> K</p>
            </div>
        </div>
    );
}

export default Expenditure;
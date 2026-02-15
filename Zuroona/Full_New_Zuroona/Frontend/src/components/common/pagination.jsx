import Image from "next/image";

export default function Pagination({ currentPage, setCurrentPage, totalPages }) {

    return (
        <div className="flex justify-center items-center mt-4 gap-3">
            <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="text-[#a797cc42] text-sm flex items-center gap-2"
            >
                <Image src="/assets/images/icons/arrow-left.png" alt="Chevron Left" width={8} height={7} />
                Previous
            </button>
            <div className="flex items-center gap-2">
                <button className="text-white bg-[#a797cc] w-9 h-9 rounded-full text-sm">
                    1
                </button>
                <button className="text-[#a797cc] w-9 h-9 border border-[#a797cc] rounded-full text-sm hover:bg-[#a797cc] hover:text-white">
                    2
                </button>
                <button className="text-[#a797cc] w-9 h-9 border border-[#a797cc] rounded-full text-sm hover:bg-[#a797cc] hover:text-white">
                    3
                </button>
            </div>
            <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="text-[#a797cc] text-sm flex items-center gap-2"
            >
                Next
                <Image src="/assets/images/icons/arrow-right.png" alt="Chevron Left" width={8} height={7} />

            </button>
        </div>
    );
}

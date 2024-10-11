import React, { useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';
import axios from "axios";
import { useHistory } from "react-router-dom"; // Import useHistory for React Router v5

const SearchBar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Quản lý việc mở/đóng hộp tìm kiếm
    const [keyword, setKeyword] = useState(""); // Từ khóa tìm kiếm
    const [results, setResults] = useState([]); // Lưu kết quả tìm kiếm
    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword); // Từ khóa sau khi debounce

    const history = useHistory(); // Use useHistory to get the history object

    // Hàm để mở/đóng hộp tìm kiếm
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen); // Mở hoặc đóng hộp tìm kiếm khi nhấn nút
    };

    // Hàm xử lý khi người dùng nhập từ khóa
    const handleInputChange = (e) => {
        setKeyword(e.target.value); // Cập nhật từ khóa tìm kiếm
    };

    // Tạo hàm tìm kiếm
    const handleSearch = async (searchKeyword) => {
        const trimmedKeyword = searchKeyword.trim(); // Loại bỏ khoảng trắng ở đầu và cuối

        // Kiểm tra nếu từ khóa trống hoặc chỉ có khoảng trắng thì không thực hiện tìm kiếm
        if (!trimmedKeyword) {
            setResults([]); // Clear results nếu từ khóa trống
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8080/user/api/variants/search?keyword=${encodeURIComponent(trimmedKeyword)}`
            );
            console.log("Kết quả tìm kiếm:", response.data);
            setResults(response.data.slice(0, 5)); // Lấy tối đa 5 kết quả
        } catch (error) {
            console.error("Lỗi khi tìm kiếm sản phẩm:", error);
            setResults([]); // Clear results nếu có lỗi
        }
    };

    // Hàm điều hướng khi ấn vào sản phẩm
    const handleViewVariantDetail = (productId) => {
        history.push(`/product/${productId}`); // Use history.push for navigation
    };

    // useEffect để xử lý debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(keyword); // Sau 1s từ khi người dùng dừng nhập, từ khóa được cập nhật
        }, 1000);

        return () => {
            clearTimeout(handler); // Xóa timeout khi người dùng vẫn đang nhập
        };
    }, [keyword]);

    // Gọi tìm kiếm khi debouncedKeyword thay đổi
    useEffect(() => {
        if (debouncedKeyword) {
            handleSearch(debouncedKeyword);
        }
    }, [debouncedKeyword]);

    return (
        <div className="relative">
            <button
                className="me-4 flex items-center text-neutral-600 dark:text-white"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={toggleSearch}
            >
                <FaSearch className="w-5 h-5" />
            </button>

            {/* Hiển thị hộp tìm kiếm khi nút được nhấn */}
            {isSearchOpen && (
                <div className="absolute top-10 left-0 bg-white shadow-lg p-4 rounded-lg w-64">
                    <h4 className="text-sm text-center mb-2">TÌM KIẾM</h4>

                    <div className="relative">
                        <input
                            type="text"
                            className="w-full border border-blue-100 rounded-lg p-2 pl-10 focus:outline-none focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={keyword}
                            onChange={handleInputChange}
                        />


                        {/* Biểu tượng kính lúp bên trong thanh tìm kiếm */}
                        <FaSearch onClick={() => handleSearch(debouncedKeyword)} className="absolute left-2 top-3 text-gray-400 cursor-pointer" />
                    </div>

                    {/* Hiển thị kết quả tìm kiếm */}
            
                    {results.length > 0 ? (
                        <div
                            className="mt-4 border-t border-gray-300 pt-2"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                            {results.map(([id, name_prod, image_prod, price]) => (
                                <div key={id} className="flex items-center mb-2 cursor-pointer" onClick={() => handleViewVariantDetail(id)}>
                                    <img
                                        src={image_prod}
                                        alt={name_prod}
                                        style={{ width: "48px", height: "48px", marginRight: "8px" }}
                                    />
                                    <div>
                                        <p className="text-xs">{name_prod}</p>
                                        <p className="text-gray-500 text-xs">{price} VND</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        keyword && <p className="mt-4 text-xs text-gray-500">Không có sản phẩm nào.</p>
                    )}

                </div>
            )}
        </div>
    );
};

export default SearchBar;

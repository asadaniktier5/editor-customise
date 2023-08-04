const SearchIcon = ({ height = 14, width = 14 }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 14 14"
            fill="gray"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.25 12.25L9.7165 9.7165M9.7165 9.7165C10.561 8.872 11.0833 7.70533 11.0833 6.41667C11.0833 3.83934 8.994 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.994 3.83934 11.0833 6.41667 11.0833C7.70533 11.0833 8.872 10.561 9.7165 9.7165Z"
                stroke="#BDBDBD"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
};

export default SearchIcon;
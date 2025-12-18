import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

export interface DropdownOption {
  value: string | number;
  label: string;
  isDisabled?: boolean;
}

interface DropdownProps {
  // Basic props
  options?: DropdownOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  name?: string;

  // Simple async loading
  fetchOptions?: () => Promise<DropdownOption[]>;
  isLoading?: boolean;

  // Advanced async with pagination (react-query)
  loadOptions?: (
    page?: number,
    searchTerm?: string
  ) => Promise<{ data: DropdownOption[]; hasMore: boolean }>;
  queryKey?: string | readonly string[];
  cacheOptions?: boolean;
  searchDebounceMs?: number;
  pageSize?: number;

  // Search
  isSearchable?: boolean;
  onInputChange?: (value: string) => void;

  // Messages
  loadingMessage?: string;
  noOptionsMessage?: string;
  loadingMoreMessage?: string;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  (
    {
      options = [],
      value = "",
      onChange,
      placeholder = "Select an option",
      className = "",
      disabled = false,
      error = "",
      name = "",
      fetchOptions,
      isLoading = false,
      loadOptions,
      queryKey,
      cacheOptions = true,
      searchDebounceMs = 500,
      isSearchable = false,
      onInputChange,
      loadingMessage = "Loading...",
      noOptionsMessage = "No options available",
      loadingMoreMessage = "Loading more...",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [simpleOptions, setSimpleOptions] =
      useState<DropdownOption[]>(options);
    const [simpleLoading, setSimpleLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const hasFetchedRef = useRef(false);

    const useAdvancedMode = !!loadOptions && !!queryKey;
    console.log("loadOptions", loadOptions);

    // Debounce search term
    useEffect(() => {
      const timer = setTimeout(
        () => setDebouncedSearchTerm(searchTerm),
        searchDebounceMs
      );
      return () => clearTimeout(timer);
    }, [searchTerm, searchDebounceMs]);

    // Advanced mode with react-query
    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      isLoading: isQueryLoading,
    } = useInfiniteQuery({
      queryKey: Array.isArray(queryKey)
        ? [...queryKey, debouncedSearchTerm]
        : [queryKey, debouncedSearchTerm],
      queryFn: ({ pageParam = 1 }) =>
        loadOptions!(pageParam, debouncedSearchTerm),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.hasMore ? allPages.length + 1 : undefined,
      initialPageParam: 1,
      enabled: useAdvancedMode && isOpen,
      staleTime: cacheOptions ? 5 * 60 * 1000 : 0,
      gcTime: cacheOptions ? 10 * 60 * 1000 : 0,
    }) ?? {
      data: undefined,
      fetchNextPage: () => {},
      hasNextPage: false,
      isFetching: false,
      isFetchingNextPage: false,
      isLoading: false,
    };

    // Flatten pages for advanced mode
    const advancedOptions = useMemo(() => {
      if (!data?.pages) return [];
      return data.pages.flatMap((page) => page.data);
    }, [data?.pages]);

    // Simple mode with fetchOptions
    useEffect(() => {
      if (
        !useAdvancedMode &&
        fetchOptions &&
        isOpen &&
        !hasFetchedRef.current
      ) {
        hasFetchedRef.current = true;
        setSimpleLoading(true);
        fetchOptions()
          .then((data) => {
            setSimpleOptions(data);
          })
          .catch((err) => {
            console.error("Error fetching dropdown options:", err);
          })
          .finally(() => {
            setSimpleLoading(false);
          });
      }

      // Reset fetch flag when dropdown closes
      if (!isOpen) {
        hasFetchedRef.current = false;
      }
    }, [fetchOptions, isOpen, useAdvancedMode]);

    // Update simple options when options prop changes (only for static options)
    useEffect(() => {
      if (!useAdvancedMode && !fetchOptions && options.length > 0) {
        setSimpleOptions(options);
      }
    }, [options.length, useAdvancedMode, fetchOptions]);

    // Click outside to close
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Handle scroll to load more
    const handleScroll = useCallback(() => {
      if (!menuRef.current || !useAdvancedMode) return;

      const { scrollTop, scrollHeight, clientHeight } = menuRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, useAdvancedMode]);

    const handleSelect = (optionValue: string | number) => {
      if (onChange) {
        onChange(optionValue);
      }
      setIsOpen(false);
      setSearchTerm("");
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchTerm(newValue);
      onInputChange?.(newValue);
    };

    const currentOptions = useAdvancedMode ? advancedOptions : simpleOptions;
    const loading = useAdvancedMode
      ? isQueryLoading || isFetching
      : simpleLoading || isLoading;

    // Filter options based on search
    const filteredOptions = useMemo(() => {
      if (!searchTerm || useAdvancedMode) return currentOptions;
      return currentOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [currentOptions, searchTerm, useAdvancedMode]);

    const selectedOption = currentOptions.find((opt) => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
      <div className="position-relative" ref={dropdownRef}>
        <div
          className={`form-control border ${className} ${
            error ? "border-danger" : ""
          } ${disabled ? "disabled" : ""}`}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          style={{
            cursor: disabled || loading ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: value ? "#161212" : "#797979",
              fontSize: "14px",
            }}
          >
            {loading && !isOpen ? loadingMessage : displayText}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            <path
              d="M11.5 5.25L7 9.75L2.5 5.25"
              stroke="#797979"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {isOpen && !disabled && (
          <div
            className="position-absolute bg-white border br10"
            style={{
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              maxHeight: "250px",
              zIndex: 1000,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Search Input */}
            {isSearchable && (
              <div
                className="p-2"
                style={{ borderBottom: "1px solid #ECECEC" }}
              >
                <input
                  type="text"
                  className="form-control border"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  style={{ fontSize: "14px" }}
                />
              </div>
            )}

            {/* Options List */}
            <div
              ref={menuRef}
              onScroll={handleScroll}
              style={{
                overflowY: "auto",
                flex: 1,
              }}
            >
              {loading && filteredOptions.length === 0 ? (
                <div
                  className="p-3 text-center"
                  style={{ color: "#797979", fontSize: "14px" }}
                >
                  {loadingMessage}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div
                  className="p-3 text-center"
                  style={{ color: "#797979", fontSize: "14px" }}
                >
                  {noOptionsMessage}
                </div>
              ) : (
                <>
                  {filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className="p-3"
                      onClick={() =>
                        !option.isDisabled && handleSelect(option.value)
                      }
                      style={{
                        cursor: option.isDisabled ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        color: option.isDisabled ? "#ccc" : "#161212",
                        backgroundColor:
                          value === option.value ? "#f6f6f4" : "transparent",
                        transition: "background-color 0.2s",
                        opacity: option.isDisabled ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!option.isDisabled) {
                          e.currentTarget.style.backgroundColor = "#f6f6f4";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          value === option.value ? "#f6f6f4" : "transparent";
                      }}
                    >
                      {option.label}
                    </div>
                  ))}

                  {/* Loading more indicator */}
                  {isFetchingNextPage && (
                    <div
                      className="p-3 text-center"
                      style={{ color: "#797979", fontSize: "14px" }}
                    >
                      {loadingMoreMessage}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Hidden select for form compatibility */}
        <select
          ref={ref}
          name={name}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{ display: "none" }}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {currentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="text-primary form-text mt-2 small">{error}</p>}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export default Dropdown;

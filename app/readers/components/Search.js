import React, { useState, useEffect, useRef } from "react";
import { FormControl, OutlinedInput, InputAdornment, List, ListItem, CircularProgress, Typography, Box } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation'; // For navigation

function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            setNoResults(false);
            setShowDropdown(false); // Hide dropdown if no search term
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setNoResults(false);
            setShowDropdown(true); // Show dropdown when searching
            try {
                const response = await axiosInstance.get(`/api/articles/search/`, {
                    params: { q: searchTerm }
                });
                const results = response.data.results;
                if (results.length > 0) {
                    setSearchResults(results);
                } else {
                    setNoResults(true); 
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
            setLoading(false);
        };

        // Debounce API request to avoid excessive calls
        const debounceTimeout = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceTimeout);

    }, [searchTerm]);

    // Close dropdown when clicking outside of the search bar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchRef]);

    // Clear search term when navigating to article detail
    const handleResultClick = (id) => {
        setSearchTerm(""); // Clear search term
        setShowDropdown(false); // Hide dropdown
        router.push(`/readers/articles/${id}`); // Navigate to the article details page
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <Box sx={{ position: 'relative', width: { xs: '100%', md: '35ch' } }} ref={searchRef}>
            <FormControl sx={{ width: { xs: '100%', md: '35ch' } }} variant="outlined">
                <OutlinedInput
                    size="small"
                    id="search"
                    placeholder="Search…"
                    value={searchTerm}
                    onChange={handleInputChange}
                    sx={{ flexGrow: 1 }}
                    startAdornment={
                        <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                            <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                    }
                    inputProps={{
                        'aria-label': 'search',
                    }}
                />
            </FormControl>

            {showDropdown && loading && (
                <List sx={{ position: 'absolute', zIndex: 5, width: '100%' }}>
                    <ListItem>
                        <CircularProgress size={24} />
                    </ListItem>
                </List>
            )}

            {showDropdown && !loading && searchResults.length > 0 && (
                <List sx={{ position: 'absolute', zIndex: 5, backgroundColor: 'white', color: 'black',  width: '100%' }}>
                    {searchResults.map(result => (
                        <ListItem button key={result.id} onClick={() => handleResultClick(result.id)}>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    WebkitLineClamp: 2,
                                    textOverflow: 'ellipsis',
                                    color: 'black'
                                }}
                                dangerouslySetInnerHTML={{ __html: result.title }}
                                />
                        </ListItem>
                    ))}
                </List>
            )}

            {showDropdown && !loading && noResults && (
                <List sx={{ position: 'absolute', zIndex: 5, backgroundColor: 'white', color: 'black', width: '100%' }}>
                    <ListItem>No results found</ListItem>
                </List>
            )}
        </Box>
    );
}

export default Search;

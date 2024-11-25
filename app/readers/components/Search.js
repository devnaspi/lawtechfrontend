import React, { useState, useEffect, useRef } from "react";
import { FormControl, OutlinedInput, InputAdornment, List, ListItem, CircularProgress, Typography, Box } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';


function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const router = useRouter();
    const theme = useTheme();


    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            setNoResults(false);
            setShowDropdown(false);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setNoResults(false);
            setShowDropdown(true);
            try {
                const response = await axiosInstance.get(`/api/articles/search/`, {
                    params: { q: searchTerm }
                });
                const results = response.data.results;
                if (results.length > 0) {
                    setSearchResults(results);
                    setNoResults(false);
                } else {
                    setSearchResults([]);    
                    setNoResults(true); 
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
                setNoResults(true);
            }
            setLoading(false);
        };

        const debounceTimeout = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceTimeout);

    }, [searchTerm]);

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

    const handleResultClick = (id) => {
        setSearchTerm("");
        setShowDropdown(false);
        router.push(`/readers/articles/${id}`);
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
                    placeholder="Search articles and contracts"
                    value={searchTerm}
                    onChange={handleInputChange}
                    sx={{ flexGrow: 1, }}
                    startAdornment={
                        <InputAdornment 
                        position="start" 
                        sx={{
                            color: (theme) =>
                                theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary',
                        }}
                        >
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

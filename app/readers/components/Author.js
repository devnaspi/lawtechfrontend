import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Box, Typography, Divider } from '@mui/material';
import { formatDate } from '@/utils/formatDate';
import { Building2 } from 'lucide-react';

function Author({ authors, created_at, company }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
                gap: 1,
            }}
        >
            {/* Company Info */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Avatar
                    src={company?.logo || undefined}
                    alt={company?.name}
                    variant="rounded"
                    sx={{
                        width: 20,
                        height: 20,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        '& img': {
                            objectFit: 'contain',
                            p: 0,
                            width: '100%',
                            height: '100%'
                        },
                        '& .fallback-icon': {
                            width: 14,
                            height: 14,
                            color: 'text.secondary',
                        }
                    }}
                >
                    <Building2 className="fallback-icon" />
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                    {company?.name}
                </Typography>
            </Box>

            <Divider />

            {/* Author Info and Date */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        alignItems: 'center'
                    }}
                >
                    <AvatarGroup max={3}>
                        {authors.map((author, index) => (
                            <Avatar
                                key={index}
                                alt={author.user.username}
                                src={author.user.profile_picture}
                                sx={{ width: 24, height: 24 }}
                            />
                        ))}
                    </AvatarGroup>
                    <Typography variant="caption">
                        {authors
                            .map((author) => {
                            const { first_name, last_name, username } = author.user;
                            const fullName = [first_name, last_name].filter(Boolean).join(' ');
                            return fullName || username;
                            })
                            .join(', ')}
                    </Typography>

                </Box>
                <Typography variant="caption">{formatDate(created_at)}</Typography>
            </Box>
        </Box>
    );
}

Author.propTypes = {
    authors: PropTypes.arrayOf(
        PropTypes.shape({
            avatar: PropTypes.string.isRequired,
            user: PropTypes.shape({
                username: PropTypes.string.isRequired,
            }).isRequired,
        }),
    ).isRequired,
    created_at: PropTypes.string.isRequired,
    company: PropTypes.shape({
        name: PropTypes.string.isRequired,
        logo: PropTypes.string,
    }),
};

export default Author;
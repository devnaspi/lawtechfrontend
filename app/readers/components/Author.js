import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Box, Typography } from '@mui/material';
import { formatDate } from '@/utils/formatDate';


function Author({ authors, created_at }) {
    return (
    <Box
        sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        }}
    >
        <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
        >
        <AvatarGroup max={3}>
            {authors.map((author, index) => (
            <Avatar
                key={index}
                alt={author.user.name}
                src={author.avatar}
                sx={{ width: 24, height: 24 }}
            />
            ))}
        </AvatarGroup>
        <Typography variant="caption">
            {authors.map((author) => author.user.name).join(', ')}
        </Typography>
        </Box>
        <Typography variant="caption">{ formatDate(created_at) }</Typography>
    </Box>
    );
}

Author.propTypes = {
    authors: PropTypes.arrayOf(
    PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
    ).isRequired,
};

export default Author
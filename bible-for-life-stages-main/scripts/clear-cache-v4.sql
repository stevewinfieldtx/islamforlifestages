-- Clear all cached content to regenerate with updated image prompts
-- Run this after syncing from Git

DELETE FROM cached_content;

-- Confirm deletion
SELECT 'Cache cleared successfully. All content will regenerate with new image rules.' as status;

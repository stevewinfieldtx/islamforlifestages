-- Clear all cached content to regenerate with new settings
-- Run this script to clear the cache

DELETE FROM cached_content;

-- Confirm deletion
SELECT 'Cache cleared successfully. All content will regenerate with new settings:' as status,
       '- Intro: 500+ tokens minimum' as change1,
       '- Stories: 750+ tokens minimum' as change2,
       '- Timeouts: 5 minutes (300 seconds)' as change3,
       '- Story images: consistent 4:3 aspect ratio' as change4;

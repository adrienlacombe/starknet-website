/**
 * Module dependencies
 */

import { Box, Grid, Icon, useBreakpointValue } from "@chakra-ui/react";
import { IoArrowForward } from "react-icons/io5";
import { Button } from "@ui/Button";
import { Heading } from "@ui/Typography/Heading";
import { useHits } from "react-instantsearch-hooks-web";
import { BlogHit } from "src/pages/posts/CategoryPage";
import { BlogCard } from "./BlogCard";
import { Topic } from "@starknet-io/cms-data/src/topics";
import { useMemo } from "react";
import { EmptySection } from "./EmptySection";


/**
 * `Props` type.
 */

export type Props = {
  title: string;
  topics: Topic[];
  url: string;
};

/**
 * Export `BlogSection` component.
 */

export const BlogSection = (props: Props) => {
  const { title, topics, url } = props;
  const { hits } = useHits<BlogHit>();
  const isMobile = useBreakpointValue({ base: true, md: false })
  const posts = useMemo(() => {
    const sectionSize = (hits.some(({ post_type }) => post_type !== 'video' && post_type !== 'audio') || isMobile) ? 3 : 2
    const paddedHits = hits.concat(Array(sectionSize).fill(undefined))
    return paddedHits.slice(0, sectionSize)
  }, [hits])
  
  return (
    <Grid
      alignItems={'center'}
      gridRowGap={'32px'}
      gridTemplateAreas={'"title more" "content content"'}
      gridTemplateColumns={'1fr auto'}
    >
      <Heading
        color={'heading-navy-fg'}
        variant={'h4'}
      >
        {title}
      </Heading>

      <Button
        as={'a'}
        gridArea={'more'}
        href={url}
        variant={'ghost'}
      >
        See more

        <Icon
          as={IoArrowForward}
          ml={2}
        />
      </Button>

      <Box
        gridArea={'content'}
        maxWidth={'100%'}
        overflowX={'auto'}
      >
        {(hits ?? []).length > 0 ? (
          <Grid
            gridGap={'24px'}
            gridTemplateColumns={`repeat(${posts.length}, 1fr)`}
            minWidth={'600px'}
          >
            {posts.map(hit => {
              if(hit) {
                return (
                  <BlogCard
                    post={hit}
                    topics={topics}
                  />
                )
              }
              
              return <Box />
            })}
          </Grid>
        ): (
          <EmptySection />
        )}
      </Box>
    </Grid>
  );
}
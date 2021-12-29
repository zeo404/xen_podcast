import React from "react";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import Link from "next/link"

export default function PodcastDetailPage({ podcast }) {
  return (
    <>
      <Link href="/">
        <div className="pl-16 pt-8 flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          <span className="text-purple-600 cursor-pointer">Go Back</span>
        </div>
      </Link>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <figure>
          <figcaption>{podcast.title}</figcaption>
          <audio controls src={podcast.record.url}>
            Your browser does not support the
            <code>audio</code> element.
          </audio>
        </figure>
        <div
          className="max-w-3xl mt-6"
          dangerouslySetInnerHTML={{ __html: podcast.description.html }}
        ></div>

        <span className="text-red-600">
          {podcast.isAdult ? "Not Appropriate" : "Appropriate"}
        </span>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query AllPodcastsQuery {
        podcasts {
          slug
        }
      }
    `,
  });
  const paths = data.podcasts.map((podcast) => ({
    params: { slug: podcast.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { data, errors } = await client.query({
    query: gql`
      query PodcastDetailQuery($slug: String!) {
        podcast(where: { slug: $slug }) {
          id
          slug
          title
          isAdult
          releaseDate
          description {
            html
          }
          categories {
            title
          }
          record {
            id
            url
          }
        }
      }
    `,
    variables: {
      slug,
    },
  });

  return {
    props: {
      podcast: data.podcast,
    },
    revalidate: 10,
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiUserPlus } from 'react-icons/fi'
import getFollowSug from '../../api/getFollowSug.api'
import './FollowSuggestions.css'
import follow_unfollow_user from '../../api/follow&unfollow.api'



export default function FollowSuggestions({ followingArr = [] }) {
  const { data } = useQuery({
    queryKey: ['followSuggestions'],
    queryFn:getFollowSug,
    select:(data)=>data?.data?.data?.suggestions
  })

  const [followedIds, setFollowedIds] = useState(new Set())
  const [hiddenSuggestionIds, setHiddenSuggestionIds] = useState(new Set())
  const [currentSlide, setCurrentSlide] = useState(0)
  const queryClient = useQueryClient()
  const followingIds = Array.isArray(followingArr) ? followingArr : []
  const suggestions = (Array.isArray(data) ? data : []).filter(
    (suggestion) => !hiddenSuggestionIds.has(suggestion._id ?? suggestion.id),
  )
  const maxSlide = Math.max(0, suggestions.length - 3)

  useEffect(() => {
    setCurrentSlide((slide) => Math.min(slide, maxSlide))
  }, [maxSlide])


  const { mutate: follow_unfollow } = useMutation({
    mutationFn:(id)=>follow_unfollow_user(id),
    onSuccess:(_response, followedId)=>{
      setHiddenSuggestionIds((currentIds) => new Set(currentIds).add(followedId))

      queryClient.invalidateQueries({
        queryKey:['followSuggestions']
      })
      queryClient.invalidateQueries({
        queryKey:['allPosts']
      })
      queryClient.invalidateQueries({
        queryKey:['profile']
      })
      // console.log('followed');
      // console.log(followingData);
      // console.log('following array',followingArr);
      
    }
  })


  return (
    <section className="follow-suggestions" aria-labelledby="follow-suggestions-title">
      <div className="follow-suggestions__heading">
        <div>
          <p className="follow-suggestions__eyebrow">Discover your circle</p>
          <h2 id="follow-suggestions-title">People you may like</h2>
        </div>
        <div className="follow-suggestions__controls">
          {suggestions.length > 3 && (
            <>
              <button
                className="follow-suggestions__arrow"
                type="button"
                onClick={() => setCurrentSlide((slide) => Math.max(0, slide - 1))}
                disabled={currentSlide === 0}
                aria-label="Show previous suggestions"
              >
                <FiArrowLeft aria-hidden="true" />
              </button>
              <button
                className="follow-suggestions__arrow"
                type="button"
                onClick={() => setCurrentSlide((slide) => Math.min(maxSlide, slide + 1))}
                disabled={currentSlide === maxSlide}
                aria-label="Show more suggestions"
              >
                <FiArrowRight aria-hidden="true" />
              </button>
            </>
          )}
          {/* <button className="follow-suggestions__view-all" type="button">
            View all <FiArrowUpRight aria-hidden="true" />
          </button> */}
        </div>
      </div>

      <div className="follow-suggestions__viewport">
        <div
          className="follow-suggestions__grid"
          style={{ '--suggestion-slide': currentSlide }}
        >
        {suggestions.map((suggestion, index) => {
          const id = suggestion._id ?? suggestion.id ?? index
          const name = suggestion.name ?? suggestion.username ?? 'Community member'
          const username = suggestion.username ?? suggestion.handle ?? '@member'
          const avatar = suggestion.avatar ?? suggestion.photo ?? suggestion.image ?? 'https://i.pravatar.cc/160?img=12'
          const isFollowed = followedIds.has(id)

          return (
            <article className="suggestion-card" key={id}>
              <div className="suggestion-card__shine" aria-hidden="true" />
              <div className="suggestion-card__topline">
                <span className="suggestion-card__rank">0{index + 1}</span>
                <span className="suggestion-card__dot" aria-hidden="true" />
                <span>Suggested for you</span>
              </div>
              <div className='flex items-center gap-2'>
                <img className="suggestion-card__avatar" src={avatar} alt={`${name}'s profile`} />
              <h3 className='text-red-400'>{name}</h3>
              </div>
              <div className="suggestion-card__footer">
                <span className="suggestion-card__followers">{suggestion.followersCount ?? 'New'} <small>followers</small></span>
                <button
                  className={`suggestion-card__follow ${isFollowed ? 'is-followed' : ''}`}
                  type="button"
                  onClick={() => follow_unfollow(suggestion._id)}>
                  {followingIds.includes(suggestion._id) ? 'Following' : 'Follow'}
                  
                </button>
              </div>
            </article>
          )
        })}
        </div>
      </div>
    </section>
  )
}

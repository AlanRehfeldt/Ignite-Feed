import { format, formatDistanceToNow } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'

import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react'

import { Avatar } from './Avatar'
import { Comment } from './Comment'
import styles from './Post.module.css'

interface Author {
    name: string
    role: string
    avatarUrl: string
}

interface Content {
    type: 'paragraph' | 'link'
    content: string
}

export interface PostType {
    id: number
    author: Author
    publishedAt: Date
    content: Content[]
}

interface PostProps {
    post: PostType
}

export function Post({ post }: PostProps) {
    const [comments, setComments] = useState([ 'Post muito bacana ein?!' ])
    const [newCommentText, setNewCommentText] = useState('')

    const publishedDateFormatted = format(post.publishedAt, "d 'de' LLLL 'às' HH:mm'h'", { locale: ptBr })
    const publishedDateRelativeNow = formatDistanceToNow(post.publishedAt, { locale: ptBr, addSuffix: true })

    function handleCreateNewComment(event: FormEvent) {
        event.preventDefault()

        setComments([...comments, newCommentText])
        setNewCommentText('')
    }
    
    function handleNewCommentChange (event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('')
        setNewCommentText(event.target.value)
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Este campo é obrigatório!')
    }

    function deleteComment(commentToDelete: string) {
        const commentsWithoutDeletedOne = comments.filter(comment => {
            return comment !== commentToDelete
        })
        
        setComments(commentsWithoutDeletedOne)
    }

    const isNewCommentEmpty = newCommentText.length === 0

    return (
        <article className={styles.post}>
            <header>
                <div className={ styles.author }>
                    <Avatar src={ post.author.avatarUrl } />
                    <div className={ styles.authorInfo }>
                        <strong>{ post.author.name }</strong>
                        <span>{ post.author.role }</span>
                    </div>
                </div>

                <time title={ publishedDateFormatted } dateTime={ post.publishedAt.toISOString() }>
                    { publishedDateRelativeNow }
                </time>
            </header>

            <div className={styles.content}>
                {
                    post.content.map(line => {
                        if(line.type === 'paragraph') {
                            return <p key={line.content} >{ line.content }</p>
                        } else {
                            return <p key={line.content} ><a href="#">{ line.content }</a></p>
                        }
                    })
                }
            </div>

            <form onSubmit={ handleCreateNewComment } className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>

                <textarea
                    placeholder='Deixe seu comentário'
                    name='comment'
                    onChange={ handleNewCommentChange }
                    value={ newCommentText }
                    onInvalid={ handleNewCommentInvalid }
                    required
                />

                <footer>
                    <button 
                        type="submit" 
                        disabled={ isNewCommentEmpty }
                    >
                        Publicar
                    </button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {
                    comments.map(comment => {
                        return (
                            <Comment 
                                key={ comment } 
                                content={ comment } 
                                onDeleteComment={ deleteComment }
                            />
                        )
                    })
                }
            </div>
        </article>
    )
}
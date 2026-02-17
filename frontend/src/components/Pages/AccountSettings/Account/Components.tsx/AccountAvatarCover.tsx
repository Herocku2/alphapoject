import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useGetUserQuery, useUpdateProfileMutation } from '../../../../../store/api/auth/authApiSlice'
import toast from 'react-hot-toast'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const AccountAvatarCover = () => {

  const { data: user } = useGetUserQuery()

  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const avatarImageRef = React.useRef<HTMLImageElement | null>(null)
  const avatarImageUploader = React.useRef<HTMLInputElement | null>(null)

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>,
    imageRef: React.RefObject<HTMLImageElement>,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        const currentImage = imageRef.current
        if (currentImage) {
          currentImage.src = event.target?.result as string
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const [updateProfile, { isSuccess, isError, error }] = useUpdateProfileMutation()

  useEffect(() => {
    if (avatarFile) {
      updateProfile({ avatar: avatarFile })
    }
  }, [avatarFile])

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("Avatar updated successfully"))
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      // Check if the error is a FetchBaseQueryError
      if ('data' in (error as FetchBaseQueryError)) {
        toast.error((error as FetchBaseQueryError).data as string);
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isError]);

  const handleReset = (
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>,
    imageRef: React.RefObject<HTMLImageElement>,
    imageUploader: React.RefObject<HTMLInputElement>,
  ) => {
    setImageFile(null)

    const defaultImageSrc = user?.avatar || 'https://via.placeholder.com/150' // Placeholder image URL
    const currentImage = imageRef.current
    if (currentImage) {
      currentImage.src = defaultImageSrc
    }

    if (imageUploader.current) {
      imageUploader.current.value = ''
    }
  }
  const { t } = useTranslation()


  return (
    <div>
      {/* The refactored and more compact component */}
      <Row className="g-0 align-items-center">
        {/* Image uploader section */}
        <Col xs="auto">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(e, setAvatarFile, avatarImageRef)
            }
            ref={avatarImageUploader}
            style={{ display: 'none' }}
          />
          <div
            style={{
              height: '5rem', // Made smaller
              width: '5rem',  // Made smaller
              cursor: 'pointer',
            }}
            className="d-flex align-items-center justify-content-center border border-3 rounded-circle overflow-hidden bg-secondary-subtle" // Changed to rounded-circle
            onClick={() => avatarImageUploader.current?.click()}
          >
            {avatarFile ? (
              <img
                src={URL.createObjectURL(avatarFile)}
                ref={avatarImageRef}
                alt="Avatar Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Ensures the image covers the circle
                }}
              />
            ) : (
              <FiPlus />
            )}
          </div>
        </Col>

        {/* Text and actions section */}
        <Col className="ms-3">
          <h6 className="fw-semibold mb-1">{t("Profile photo")}</h6>
          <p className="text-muted small mb-1">
            {t("Click the image to upload a new one.")}
          </p>
          <Link
            to="#!"
            className="text-danger small fw-medium"
            onClick={() => handleReset(setAvatarFile, avatarImageRef, avatarImageUploader)}>
            {t("Reset")}
          </Link>
        </Col>
      </Row>
    </div>
  )
}

export default AccountAvatarCover

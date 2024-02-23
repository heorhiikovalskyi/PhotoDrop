Here is the backend part for PhotoDrop, a great app for connecting photographers and clients. Photographers upload images into albums and assign users to them. Users can purchase and download images; otherwise, they view images with a watermark. Admins register photographers using the no-code tool **Retool**. Authorization flow is provided with **JWT**, and for payment purposes, **Stripe** is utilized.

## Images handling

### AWS

Images are stored in S3 buckets. There is special trigger that is invoked when some file is created. Trigger creates watermarked image and blurred image to store them in another bucket. Additionally, it inserts new rows in db.

### Sharp

Sharp module is used to blur, resize and watermark images. It is deployed using AWS layers to match AWS environment.

## Deployment

Docker is used and project is deployed on Fly.io service.

## Documentation

You can get familiar with work done reading [documentation](https://photodropdoc.fly.dev/)

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UrlDocument = HydratedDocument<Url>;

@Schema({
    timestamps: true,
})
export class Url {

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    })
    userId!: Types.ObjectId;

    @Prop({
        required: true,
        trim: true,
    })
    originalUrl!: string;

    @Prop({
        required: true,
        unique: true,
        index: true,
        trim: true,
    })
    shortCode!: string;

    @Prop({
        default: 0,
        min: 0,
    })
    clicks!: number;

    @Prop({
        default: true,
    })
    isActive!: boolean;

    @Prop()
    expiresAt?: Date;

    createdAt!: Date;

    updatedAt!: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
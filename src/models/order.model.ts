import { Schema, model, Types } from "mongoose";
import { Food, FoodSchema } from "./food.model";

export interface LatLng {
  lat: string;
  lng: string;
}

export interface OrderItem {
  food: Food;
  price: number;
  count: number;
}

export const LatLngSchema = new Schema<LatLng>({
  lat: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    required: true,
  },
});

export const OrderItemSchema = new Schema<OrderItem>({
  food: {
    type: FoodSchema,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

export enum OrderStatusStates {
  NEW = "NEW",
  PAYED = "PAYED",
  SHIPPED = "SHIPPED",
  CANCELED = "CANCELED",
  REFUNDED = "REFUNDED",
}

export interface Order {
  user: Types.ObjectId;
  id: number;
  items: OrderItem[];
  totalPrice: number;
  name: string;
  address: string;
  latlong: LatLng;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatusStates;
}

const OrderSchema = new Schema<Order>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    latlong: {
      type: LatLngSchema,
      required: true,
    },
    paymentId: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    status: {
      type: String,
      default: OrderStatusStates.NEW,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const OrderModel = model("order", OrderSchema);

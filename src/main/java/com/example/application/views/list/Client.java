package com.example.application.views.list;

import com.vaadin.fusion.Nonnull;

public class Client {

    @Nonnull
    private int id;
    @Nonnull
    private String img;
    @Nonnull
    private String client;
    @Nonnull
    private double amount;
    @Nonnull
    private String status;
    @Nonnull
    private String date;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getClient() {
        return client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}

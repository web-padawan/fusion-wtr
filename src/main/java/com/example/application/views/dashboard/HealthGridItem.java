package com.example.application.views.dashboard;

import java.time.LocalDate;

import com.vaadin.fusion.Nonnull;

/**
 * Simple DTO class for the inbox list to demonstrate complex object data
 */
public class HealthGridItem {

    @Nonnull
    private LocalDate date;
    @Nonnull
    private String city;
    @Nonnull
    private String country;
    @Nonnull
    private String status;
    @Nonnull
    private String theme;

    public HealthGridItem() {

    }

    public HealthGridItem(LocalDate date, String city, String country, String status, String theme) {
        this.date = date;
        this.city = city;
        this.country = country;
        this.status = status;
        this.theme = theme;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}

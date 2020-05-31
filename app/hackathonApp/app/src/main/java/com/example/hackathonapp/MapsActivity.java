// MapsActivity.java
// Developed by Ansh Gwash
package com.example.hackathonapp;


import androidx.fragment.app.FragmentActivity;

import android.app.ProgressDialog;
import android.net.Uri;
import android.os.Bundle;

import com.android.volley.toolbox.StringRequest;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import org.json.*;
import java.util.*;
import java.lang.Object;
import android.content.Intent;
import com.android.volley.toolbox.Volley;
import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Adapter;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Button;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {
    private GoogleMap mMap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);

        final Button button = findViewById(R.id.button1);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // code for button press
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://forms.gle/rV7h5x1cPznNJv8Q8"));
                startActivity(browserIntent);
            }
        });


        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);


    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        googleMap.getUiSettings().setZoomControlsEnabled(true);

        // start
        LatLng usa = new LatLng(39.50, -98.35);

        mMap.moveCamera(CameraUpdateFactory.newLatLng(usa));
        mMap.getUiSettings().setMapToolbarEnabled(false);
        // end

        getItems();


    }

    public void getItems() {
        StringRequest stringRequest = new StringRequest(Request.Method.GET, "https://script.google.com/macros/s/AKfycbxOLElujQcy1-ZUer1KgEvK16gkTLUqYftApjNCM_IRTL3HSuDk/exec?id=1kn8vIEY1vZXtMSWz40bnvopderkFqYuvWx1lDg5uhvM&sheet=Form Responses",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        parseItems(response);
                    }
                },

                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                    }
                }
        );

        int socketTimeOut = 50000;
        RetryPolicy policy = new DefaultRetryPolicy(socketTimeOut, 0, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT);

        stringRequest.setRetryPolicy(policy);

        RequestQueue queue = Volley.newRequestQueue(this);
        queue.add(stringRequest);
    }

    private void parseItems(String jsonResponse) {

        ArrayList<HashMap<String, String>> list = new ArrayList<>();

        try {
            JSONObject jobj = new JSONObject(jsonResponse);
            // can replace Sheet1 based on json
            JSONArray jarray = jobj.getJSONArray("Form Responses");

            mMap.setInfoWindowAdapter(new CustomInfoWindowAdapter(MapsActivity.this));
            for (int i = 0; i < jarray.length(); i++) {

                JSONObject jo = jarray.getJSONObject(i);

                String description = jo.getString("Please_enter_your_message");
                String name = jo.getString("Please_enter_your_initials.");
                String age = jo.getString("Please_enter_your_age");
                String city = jo.getString("Please_enter_your_city");
                String state = jo.getString("Please_enter_your_state/providence");
                int lat = jo.getInt("Latitude");
                int lon = jo.getInt("Longitude");


                // creating marker
                LatLng latsMark = new LatLng(lat, lon);

                mMap.addMarker(new MarkerOptions()
                        .position(latsMark)
                        .title(name + ", " + age)
                        .snippet("\n"+description + "\nLocation: "+ city + ", " + state));
                // end

                HashMap<String, String> item = new HashMap<>();
                item.put("Description", description);
                item.put("Name", name);

                list.add(item);


            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}